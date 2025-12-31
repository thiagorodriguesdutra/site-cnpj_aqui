"use server";

import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { cnpjQueries } from "@/lib/db/schema";
import {
  AuthenticationError,
  ExternalAPIError,
  RateLimitError,
  ValidationError,
} from "@/lib/errors";
import { createLogger } from "@/lib/logger";
import { rateLimit } from "@/lib/rate-limit";
import { queryCNPJSchema } from "@/lib/schemas";
import { queryCNPJ } from "@/lib/services/cnpj.service";
import {
  getCreditBalance,
  hasAvailableCredits,
} from "@/lib/services/credits.service";
import { maskCNPJ } from "@/lib/utils";

const logger = createLogger("action-consultar-cnpj");

export async function queryCNPJAction(input: { cnpj: string }) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new AuthenticationError("Usuário não autenticado");
    }

    const validated = queryCNPJSchema.parse(input);
    const cleanedCNPJ = validated.cnpj;
    const cnpjMasked = maskCNPJ(cleanedCNPJ);

    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `cnpj:${user.id}:${ip}`;
    const rateLimitResult = rateLimit(rateLimitKey);

    if (!rateLimitResult.success) {
      const resetInSeconds = Math.ceil(
        (rateLimitResult.reset - Date.now()) / 1000,
      );
      logger.warn(
        { userId: user.id, ip, operation: "consultarCNPJ" },
        "Rate limit excedido para consulta de CNPJ",
      );
      throw new RateLimitError(
        `Muitas requisições. Aguarde ${resetInSeconds} segundos.`,
      );
    }

    const hasCredits = await hasAvailableCredits(user.id);

    if (!hasCredits) {
      logger.warn(
        { userId: user.id, cnpj: cnpjMasked },
        "Usuário sem créditos disponíveis",
      );
      return {
        success: false,
        error:
          "Você não tem créditos disponíveis. Adquira mais créditos para continuar.",
      };
    }

    logger.info({ userId: user.id, cnpj: cnpjMasked }, "Consultando CNPJ");

    const cnpjData = await queryCNPJ(cleanedCNPJ);

    await db.insert(cnpjQueries).values({
      userId: user.id,
      cnpj: cleanedCNPJ,
      responseData: cnpjData,
    });

    const balance = await getCreditBalance(user.id);

    logger.info(
      {
        userId: user.id,
        cnpj: cnpjMasked,
        creditsRemaining: balance.availableCredits,
      },
      "CNPJ consultado e registrado com sucesso (preview não consome crédito)",
    );

    return {
      success: true,
      data: cnpjData,
      creditsRemaining: balance.availableCredits,
      creditConsumed: false,
      message:
        "Preview não consome crédito. Crédito será debitado ao baixar o PDF ou compartilhar.",
    };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (error instanceof RateLimitError) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (error instanceof Error && "errors" in error) {
      const validationError = ValidationError.fromZodError(
        error as { errors: Array<{ path: string[]; message: string }> },
      );
      logger.warn(
        { validationErrors: validationError.errors },
        "Erro de validação no CNPJ",
      );
      return {
        success: false,
        error: "CNPJ inválido",
      };
    }

    if (error instanceof ExternalAPIError) {
      logger.error(
        { error: error.message, api: error.api },
        "Erro ao consultar API externa",
      );
      return {
        success: false,
        error: error.message,
      };
    }

    logger.error(
      { error, operation: "consultarCNPJAction" },
      "Erro inesperado ao consultar CNPJ",
    );
    return {
      success: false,
      error: "Erro ao consultar CNPJ. Tente novamente mais tarde.",
    };
  }
}
