import { renderToBuffer } from "@react-pdf/renderer";
import { and, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, issuedDocuments } from "@/lib/db";
import { createLogger } from "@/lib/logger";
import { CartaoCNPJ } from "@/lib/pdf/cartao-cnpj";
import { generateQRCodeDataUrl } from "@/lib/pdf/generate-qr-code";
import { rateLimit } from "@/lib/rate-limit";
import type { CnpjData } from "@/lib/services/cnpj.service";
import {
  consumeCredit,
  hasAvailableCredits,
} from "@/lib/services/credits.service";
import { maskCNPJ } from "@/lib/utils";

const logger = createLogger("api-pdf-cartao-cnpj");

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      logger.warn({ url: request.url }, "Requisição GET sem documentId");
      return NextResponse.json(
        { error: "documentId é obrigatório" },
        { status: 400 },
      );
    }

    const [document] = await db
      .select()
      .from(issuedDocuments)
      .where(eq(issuedDocuments.id, documentId))
      .limit(1);

    if (!document) {
      logger.warn({ documentId }, "Documento não encontrado");
      return NextResponse.json(
        { error: "Documento não encontrado" },
        { status: 404 },
      );
    }

    const cnpjData = document.documentData as CnpjData;

    logger.info(
      { documentId, cnpj: maskCNPJ(cnpjData.cnpj) },
      "Download público de PDF via validação",
    );

    const qrCodeDataUrl = await generateQRCodeDataUrl(documentId);

    const pdfBuffer = await renderToBuffer(
      CartaoCNPJ({
        data: cnpjData,
        emitidoEm: document.issuedAt,
        documentId: document.id,
        qrCodeDataUrl,
      }),
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cartao-cnpj-${cnpjData.cnpj}.pdf"`,
      },
    });
  } catch (error) {
    logger.error(
      { error, operation: "generatePublicPDF" },
      "Erro ao gerar PDF público",
    );
    return NextResponse.json({ error: "Erro ao gerar PDF" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      logger.warn(
        { url: request.url },
        "Tentativa de gerar PDF sem autenticação",
      );
      return NextResponse.json(
        { error: "Autenticação necessária" },
        { status: 401 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitKey = `pdf:${user.id}:${ip}`;
    const rateLimitResult = rateLimit(rateLimitKey);

    if (!rateLimitResult.success) {
      const resetInSeconds = Math.ceil(
        (rateLimitResult.reset - Date.now()) / 1000,
      );
      logger.warn(
        { userId: user.id, ip, operation: "generatePDF" },
        "Rate limit excedido para geração de PDF",
      );
      return NextResponse.json(
        {
          error: `Muitas requisições. Aguarde ${resetInSeconds} segundos.`,
        },
        { status: 429 },
      );
    }

    const body = await request.json();
    const cnpjData = body.data as CnpjData;

    if (!cnpjData || !cnpjData.cnpj) {
      logger.warn(
        { userId: user.id },
        "Dados do CNPJ não fornecidos na requisição",
      );
      return NextResponse.json(
        { error: "Dados do CNPJ não fornecidos" },
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

    let creditConsumed = false;

    if (!existingDocument) {
      const hasCredits = await hasAvailableCredits(user.id);

      if (!hasCredits) {
        logger.warn(
          { userId: user.id, cnpj: cnpjMasked },
          "Usuário sem créditos para gerar PDF",
        );
        return NextResponse.json(
          {
            error:
              "Você não tem créditos disponíveis. Adquira mais créditos para continuar.",
          },
          { status: 402 },
        );
      }

      const creditResult = await consumeCredit(
        user.id,
        cnpjData.cnpj,
        `Download PDF CNPJ ${cnpjData.cnpj}`,
      );

      creditConsumed = creditResult.consumed;

      const [newDocument] = await db
        .insert(issuedDocuments)
        .values({
          userId: user.id,
          cnpj: cnpjData.cnpj,
          documentData: cnpjData,
        })
        .returning();

      logger.info(
        {
          userId: user.id,
          cnpj: cnpjMasked,
          documentId: newDocument.id,
          creditConsumed,
          creditsRemaining: creditResult.remainingCredits,
        },
        "PDF gerado e crédito consumido",
      );

      const qrCodeDataUrl = await generateQRCodeDataUrl(newDocument.id);

      const pdfBuffer = await renderToBuffer(
        CartaoCNPJ({
          data: cnpjData,
          emitidoEm: new Date(),
          documentId: newDocument.id,
          qrCodeDataUrl,
        }),
      );

      logger.info(
        { userId: user.id, cnpj: cnpjMasked, documentId: newDocument.id },
        "PDF gerado com UUID e QR Code",
      );

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="cartao-cnpj-${cnpjData.cnpj}.pdf"`,
        },
      });
    } else {
      logger.info(
        {
          userId: user.id,
          cnpj: cnpjMasked,
          documentId: existingDocument.id,
        },
        "Re-download de PDF (sem consumo de crédito)",
      );

      const qrCodeDataUrl = await generateQRCodeDataUrl(existingDocument.id);

      const pdfBuffer = await renderToBuffer(
        CartaoCNPJ({
          data: cnpjData,
          emitidoEm: existingDocument.issuedAt,
          documentId: existingDocument.id,
          qrCodeDataUrl,
        }),
      );

      logger.info(
        { userId: user.id, cnpj: cnpjMasked, documentId: existingDocument.id },
        "PDF gerado com UUID existente",
      );

      return new NextResponse(new Uint8Array(pdfBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="cartao-cnpj-${cnpjData.cnpj}.pdf"`,
        },
      });
    }
  } catch (error) {
    logger.error(
      { error, operation: "generateAuthenticatedPDF" },
      "Erro ao gerar PDF",
    );
    return NextResponse.json({ error: "Erro ao gerar PDF" }, { status: 500 });
  }
}
