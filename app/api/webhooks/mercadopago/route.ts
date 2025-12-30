import { and, desc, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { creditTransactions, plans, users } from "@/lib/db/schema";
import { createLogger } from "@/lib/logger";
import { MercadoPagoPaymentAdapter } from "@/lib/payment/adapters/mercadopago.adapter";
import { addCredits } from "@/lib/services/credits.service";

const logger = createLogger("mercadopago-webhook");

const processedPayments = new Set<string>();

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, type } = body;

    if (!type || !data) {
      logger.warn({ body }, "Webhook recebido com formato inválido");
      return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
    }

    if (type !== "order") {
      logger.info(
        { type },
        "Webhook de tipo não processado (apenas order é processado)",
      );
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const orderId = data.id;

    if (!orderId) {
      logger.warn({ body }, "Webhook sem orderId");
      return NextResponse.json({ error: "orderId ausente" }, { status: 400 });
    }

    logger.info({ orderId, type }, "Webhook de order recebido do Mercado Pago");

    const paymentAdapter = new MercadoPagoPaymentAdapter();

    const order = await paymentAdapter.getOrder(orderId);

    logger.info(
      { orderId, status: order.status, statusDetail: order.statusDetail },
      "Order consultada",
    );

    if (order.status !== "processed") {
      logger.info(
        { orderId, status: order.status },
        "Order não está processada, ignorando webhook",
      );
      return NextResponse.json({ received: true }, { status: 200 });
    }

    logger.info(
      { orderId, paymentsCount: order.payments?.length || 0 },
      "Order processada, verificando payments",
    );

    const payment = order.payments[0];

    if (!payment) {
      logger.warn(
        { orderId, payments: order.payments },
        "Order sem payment ou payments array vazio",
      );
      return NextResponse.json({ error: "Payment ausente" }, { status: 400 });
    }

    logger.info(
      { orderId, paymentId: payment.id },
      "Payment encontrado, continuando processamento",
    );

    const paymentId = payment.id;

    if (processedPayments.has(paymentId)) {
      logger.info(
        { paymentId, orderId },
        "Evento ignorado: payment já processado nesta sessão (guard in-memory)",
      );
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const externalReference = order.externalReference;

    logger.info({ orderId, externalReference }, "Parseando externalReference");

    const parts = externalReference.split("-");

    if (parts.length !== 3) {
      logger.error(
        { externalReference, orderId, partsLength: parts.length, parts },
        "Formato de externalReference inválido",
      );
      return NextResponse.json(
        { error: "externalReference inválido" },
        { status: 400 },
      );
    }

    logger.info(
      { orderId, userIdPrefix: parts[0], planIdPrefix: parts[1] },
      "ExternalReference parseado, buscando user e plan",
    );

    const [userIdPrefix, planIdPrefix] = parts;

    const [user] = await db
      .select()
      .from(users)
      .where(sql`CAST(${users.id} AS TEXT) LIKE ${`${userIdPrefix}%`}`)
      .limit(1);

    const [plan] = await db
      .select()
      .from(plans)
      .where(sql`CAST(${plans.id} AS TEXT) LIKE ${`${planIdPrefix}%`}`)
      .limit(1);

    if (!user || !plan) {
      logger.error(
        {
          userIdPrefix,
          planIdPrefix,
          orderId,
          foundUser: !!user,
          foundPlan: !!plan,
        },
        "Usuário ou plano não encontrado a partir do externalReference",
      );
      return NextResponse.json(
        { error: "Usuário ou plano não encontrado" },
        { status: 400 },
      );
    }

    const userId = user.id;
    const planId = plan.id;

    logger.info(
      { orderId, userId, planId },
      "User e plan encontrados, verificando transações recentes",
    );

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const recentTransactions = await db
      .select()
      .from(creditTransactions)
      .where(
        and(
          eq(creditTransactions.userId, userId),
          eq(creditTransactions.planId, planId),
          eq(creditTransactions.type, "purchase"),
          gte(creditTransactions.createdAt, fiveMinutesAgo),
        ),
      )
      .orderBy(desc(creditTransactions.createdAt))
      .limit(1);

    if (recentTransactions.length > 0) {
      logger.warn(
        {
          paymentId,
          orderId,
          userId,
          planId,
          lastTransactionAt: recentTransactions[0].createdAt,
        },
        "Evento ignorado: transação recente detectada (possível duplicação)",
      );
      processedPayments.add(paymentId);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    logger.info(
      { userId, planId, paymentId, orderId, credits: plan.credits },
      "Processando concessão de créditos",
    );

    processedPayments.add(paymentId);

    await addCredits(
      userId,
      plan.credits,
      `Compra do plano ${plan.name} via PIX`,
      planId,
    );

    revalidatePath("/painel");
    revalidatePath("/uso");
    revalidatePath("/planos");

    logger.info(
      { userId, planId, paymentId, orderId, creditsAdded: plan.credits },
      "Créditos concedidos com sucesso",
    );

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        errorType: error?.constructor?.name,
      },
      "Erro ao processar webhook",
    );

    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 },
    );
  }
}
