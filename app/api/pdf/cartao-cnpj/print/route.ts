import { and, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, issuedDocuments } from "@/lib/db";
import { createLogger } from "@/lib/logger";
import { generateQRCodeDataUrl } from "@/lib/pdf/generate-qr-code";
import { renderCartaoCNPJToHTML } from "@/lib/pdf/html/render-html";
import { rateLimit } from "@/lib/rate-limit";
import type { CnpjData } from "@/lib/services/cnpj.service";
import {
  consumeCredit,
  hasAvailableCredits,
} from "@/lib/services/credits.service";
import { maskCNPJ } from "@/lib/utils";

const logger = createLogger("api-pdf-cartao-cnpj-print");

function wrapHtmlForPrint(html: string): string {
  const printScript = `
    <script>
      window.onload = function() {
        window.print();
        window.onafterprint = function() {
          window.close();
        };
      };
    </script>
  `;

  return html.replace("</body>", `${printScript}</body>`);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      logger.warn(
        { url: request.url },
        "Tentativa de imprimir sem autenticacao",
      );
      return NextResponse.json(
        { error: "Autenticacao necessaria" },
        { status: 401 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitKey = `print:${user.id}:${ip}`;
    const rateLimitResult = rateLimit(rateLimitKey);

    if (!rateLimitResult.success) {
      const resetInSeconds = Math.ceil(
        (rateLimitResult.reset - Date.now()) / 1000,
      );
      logger.warn(
        { userId: user.id, ip, operation: "printHTML" },
        "Rate limit excedido para impressao",
      );
      return NextResponse.json(
        {
          error: `Muitas requisicoes. Aguarde ${resetInSeconds} segundos.`,
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const cnpjData = body.data as CnpjData;

    if (!cnpjData || !cnpjData.cnpj) {
      logger.warn(
        { userId: user.id },
        "Dados do CNPJ nao fornecidos para impressao",
      );
      return NextResponse.json(
        { error: "Dados do CNPJ nao fornecidos" },
        { status: 400 },
      );
    }

    const cnpjMasked = maskCNPJ(cnpjData.cnpj);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [existingDocument] = await db
      .select()
      .from(issuedDocuments)
      .where(
        and(
          eq(issuedDocuments.userId, user.id),
          eq(issuedDocuments.cnpj, cnpjData.cnpj),
          gte(issuedDocuments.issuedAt, today),
        ),
      )
      .limit(1);

    let documentId: string;
    let emitidoEm: Date;

    if (!existingDocument) {
      const hasCredits = await hasAvailableCredits(user.id);

      if (!hasCredits) {
        logger.warn(
          { userId: user.id, cnpj: cnpjMasked },
          "Usuario sem creditos para imprimir",
        );
        return NextResponse.json(
          {
            error:
              "Voce nao tem creditos disponiveis. Adquira mais creditos para continuar.",
          },
          { status: 402 },
        );
      }

      const creditResult = await consumeCredit(
        user.id,
        cnpjData.cnpj,
        `Impressao Cartao CNPJ ${cnpjData.cnpj}`,
      );

      const [newDocument] = await db
        .insert(issuedDocuments)
        .values({
          userId: user.id,
          cnpj: cnpjData.cnpj,
          documentData: cnpjData,
        })
        .returning();

      documentId = newDocument.id;
      emitidoEm = new Date();

      logger.info(
        {
          userId: user.id,
          cnpj: cnpjMasked,
          documentId,
          creditConsumed: creditResult.consumed,
          creditsRemaining: creditResult.remainingCredits,
        },
        "HTML para impressao gerado e credito consumido",
      );
    } else {
      documentId = existingDocument.id;
      emitidoEm = existingDocument.issuedAt;

      logger.info(
        {
          userId: user.id,
          cnpj: cnpjMasked,
          documentId,
        },
        "Re-impressao de HTML (sem consumo de credito)",
      );
    }

    const qrCodeDataUrl = await generateQRCodeDataUrl(documentId);

    const html = renderCartaoCNPJToHTML({
      data: cnpjData,
      emitidoEm,
      documentId,
      qrCodeDataUrl,
    });

    const printableHtml = wrapHtmlForPrint(html);

    return new NextResponse(printableHtml, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ errorMessage }, "Erro ao gerar HTML para impressao");
    return NextResponse.json(
      { error: "Erro ao gerar pagina de impressao" },
      { status: 500 },
    );
  }
}
