import { and, desc, eq, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { creditTransactions } from "@/lib/db/schema";
import { createLogger } from "@/lib/logger";

const logger = createLogger("api-check-payment-status");

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const planId = searchParams.get("planId");
    const since = searchParams.get("since");

    if (!planId || !since) {
      return NextResponse.json(
        { error: "Parâmetros planId e since são obrigatórios" },
        { status: 400 },
      );
    }

    const sinceDate = new Date(Number(since));

    logger.info(
      { userId: user.id, planId, since: sinceDate },
      "Verificando status de pagamento",
    );

    const recentTransaction = await db
      .select()
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.userId, user.id),
          eq(creditTransactions.planId, planId),
          eq(creditTransactions.type, "purchase"),
          gte(creditTransactions.createdAt, sinceDate),
        ),
      )
      .orderBy(desc(creditTransactions.createdAt))
      .limit(1);

    if (recentTransaction.length > 0) {
      logger.info(
        {
          userId: user.id,
          planId,
          transactionId: recentTransaction[0].id,
        },
        "Pagamento confirmado - transação encontrada",
      );

      return NextResponse.json({
        paid: true,
        transaction: {
          id: recentTransaction[0].id,
          amount: recentTransaction[0].amount,
          createdAt: recentTransaction[0].createdAt,
        },
      });
    }

    return NextResponse.json({ paid: false });
  } catch (error) {
    logger.error({ error }, "Erro ao verificar status de pagamento");

    return NextResponse.json(
      { error: "Erro ao verificar status" },
      { status: 500 },
    );
  }
}
