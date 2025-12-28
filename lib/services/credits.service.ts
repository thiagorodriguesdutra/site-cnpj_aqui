import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  type CreditTransaction,
  cnpjQueries,
  creditTransactions,
  type UserCredit,
  userCredits,
} from "@/lib/db/schema";
import { createLogger } from "@/lib/logger";
import { maskCNPJ } from "../utils";

const logger = createLogger("credits-service");

export interface CreditBalance {
  availableCredits: number;
  totalUsed: number;
}

export interface CreditConsumptionResult {
  consumed: boolean;
  reason?: string;
  remainingCredits: number;
}

export async function getUserCredits(
  userId: string,
): Promise<UserCredit | null> {
  const [credits] = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId))
    .limit(1);

  return credits || null;
}

export async function getCreditBalance(userId: string): Promise<CreditBalance> {
  const credits = await getUserCredits(userId);

  if (!credits) {
    return {
      availableCredits: 0,
      totalUsed: 0,
    };
  }

  return {
    availableCredits: credits.availableCredits,
    totalUsed: credits.totalUsed,
  };
}

export async function hasAvailableCredits(userId: string): Promise<boolean> {
  const balance = await getCreditBalance(userId);
  return balance.availableCredits > 0;
}

export async function hasCnpjBeenQueriedToday(
  userId: string,
  cnpj: string,
): Promise<boolean> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(cnpjQueries)
    .where(
      and(
        eq(cnpjQueries.userId, userId),
        eq(cnpjQueries.cnpj, cnpj),
        gte(cnpjQueries.queriedAt, today),
      ),
    );

  return (result?.count ?? 0) > 0;
}

export async function consumeCredit(
  userId: string,
  cnpj: string,
  description: string,
): Promise<CreditConsumptionResult> {
  const credits = await getUserCredits(userId);

  if (!credits || credits.availableCredits <= 0) {
    logger.warn({ userId }, "Tentativa de consumo sem créditos disponíveis");
    return {
      consumed: false,
      reason: "Sem créditos disponíveis",
      remainingCredits: 0,
    };
  }

  await db.transaction(async (tx) => {
    await tx
      .update(userCredits)
      .set({
        availableCredits: credits.availableCredits - 1,
        totalUsed: credits.totalUsed + 1,
      })
      .where(eq(userCredits.userId, userId));

    await tx.insert(creditTransactions).values({
      userId,
      type: "usage",
      amount: -1,
      description,
    });
  });

  logger.info(
    {
      userId,
      cnpj: maskCNPJ(cnpj),
      remainingCredits: credits.availableCredits - 1,
    },
    "Crédito consumido com sucesso",
  );

  return {
    consumed: true,
    remainingCredits: credits.availableCredits - 1,
  };
}

export async function addCredits(
  userId: string,
  amount: number,
  description: string,
  planId?: string,
): Promise<void> {
  const credits = await getUserCredits(userId);

  if (!credits) {
    await db.insert(userCredits).values({
      userId,
      availableCredits: amount,
      totalUsed: 0,
    });
  } else {
    await db
      .update(userCredits)
      .set({
        availableCredits: credits.availableCredits + amount,
      })
      .where(eq(userCredits.userId, userId));
  }

  await db.insert(creditTransactions).values({
    userId,
    type: "purchase",
    amount,
    description,
    planId,
  });

  logger.info({ userId, amount, planId }, "Créditos adicionados com sucesso");
}

export async function getCreditTransactions(
  userId: string,
  limit = 50,
): Promise<CreditTransaction[]> {
  const transactions = await db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.userId, userId))
    .orderBy(desc(creditTransactions.createdAt))
    .limit(limit);

  return transactions;
}

export async function initializeUserCredits(userId: string): Promise<void> {
  const existingCredits = await getUserCredits(userId);

  if (!existingCredits) {
    await db.insert(userCredits).values({
      userId,
      availableCredits: 3,
      totalUsed: 0,
    });

    await db.insert(creditTransactions).values({
      userId,
      type: "bonus",
      amount: 3,
      description: "Créditos iniciais de boas-vindas",
    });

    logger.info({ userId }, "Créditos iniciais criados para usuário");
  }
}
