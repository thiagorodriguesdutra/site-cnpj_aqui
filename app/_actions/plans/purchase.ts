"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { BusinessError } from "@/lib/errors/business-error";
import { createLogger } from "@/lib/logger";
import { addCredits } from "@/lib/services/credits.service";

const logger = createLogger("purchase-plan");

export async function purchasePlan(planId: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new BusinessError("Usuário não autenticado");
  }

  // Busca dados do plano
  const [plan] = await db.select().from(plans).where(eq(plans.id, planId));

  if (!plan) {
    logger.error({ planId }, "Plano não encontrado");
    throw new BusinessError("Plano não encontrado");
  }

  if (!plan.isActive) {
    logger.error({ planId }, "Plano não está ativo");
    throw new BusinessError("Plano não está disponível para compra");
  }

  logger.info(
    { userId: user.id, planId, planName: plan.name, credits: plan.credits },
    "Processando compra de plano",
  );

  // Adiciona créditos ao usuário
  await addCredits(
    user.id,
    plan.credits,
    `Compra do plano ${plan.name}`,
    plan.id,
  );

  logger.info(
    { userId: user.id, planId, credits: plan.credits },
    "Compra processada com sucesso",
  );

  // Revalida páginas que mostram saldo de créditos
  revalidatePath("/painel");
  revalidatePath("/uso");
  revalidatePath("/planos");

  return {
    success: true,
    creditsAdded: plan.credits,
    planName: plan.name,
  };
}
