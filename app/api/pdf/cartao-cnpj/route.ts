import { and, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db, issuedDocuments } from "@/lib/db";
import { createLogger } from "@/lib/logger";
import { generateQRCodeDataUrl } from "@/lib/pdf/generate-qr-code";
import { generatePDFFromHTML } from "@/lib/pdf/html/generate-pdf";
import { renderCartaoCNPJToHTML } from "@/lib/pdf/html/render-html";
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
      logger.warn({ url: request.url }, "Requisicao GET sem documentId");
      return NextResponse.json(
        { error: "documentId e obrigatorio" },
        { status: 400 },
      );
    }

    const [document] = await db
      .select()
      .from(issuedDocuments)
      .where(eq(issuedDocuments.id, documentId))
      .limit(1);

    if (!document) {
      logger.warn({ documentId }, "Documento nao encontrado");
      return NextResponse.json(
        { error: "Documento nao encontrado" },
        { status: 404 },
      );
    }

    const cnpjData = document.documentData as CnpjData;

    logger.info(
      { documentId, cnpj: maskCNPJ(cnpjData.cnpj) },
      "Download publico de PDF via validacao",
    );

    const qrCodeDataUrl = await generateQRCodeDataUrl(documentId);

    const html = renderCartaoCNPJToHTML({
      data: cnpjData,
      emitidoEm: document.issuedAt,
      documentId: document.id,
      qrCodeDataUrl,
    });

    const pdfBuffer = await generatePDFFromHTML(html);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cartao-cnpj-${cnpjData.cnpj}.pdf"`,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ errorMessage }, "Erro ao gerar PDF publico");
    return NextResponse.json({ error: "Erro ao gerar PDF" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      logger.warn(
        { url: request.url },
        "Tentativa de gerar PDF sem autenticacao",
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
    const rateLimitKey = `pdf:${user.id}:${ip}`;
    const rateLimitResult = rateLimit(rateLimitKey);

    if (!rateLimitResult.success) {
      const resetInSeconds = Math.ceil(
        (rateLimitResult.reset - Date.now()) / 1000,
      );
      logger.warn(
        { userId: user.id, ip, operation: "generatePDF" },
        "Rate limit excedido para geracao de PDF",
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
        "Dados do CNPJ nao fornecidos na requisicao",
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
          "Usuario sem creditos para gerar PDF",
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
        `Download PDF CNPJ ${cnpjData.cnpj}`,
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
        "PDF gerado e credito consumido",
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
        "Re-download de PDF (sem consumo de credito)",
      );
    }

    const qrCodeDataUrl = await generateQRCodeDataUrl(documentId);

    const html = renderCartaoCNPJToHTML({
      data: cnpjData,
      emitidoEm,
      documentId,
      qrCodeDataUrl,
    });

    const pdfBuffer = await generatePDFFromHTML(html);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cartao-cnpj-${cnpjData.cnpj}.pdf"`,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error({ errorMessage }, "Erro ao gerar PDF");
    return NextResponse.json({ error: "Erro ao gerar PDF" }, { status: 500 });
  }
}
