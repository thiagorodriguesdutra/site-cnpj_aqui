import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { createLogger } from "@/lib/logger";
import { MercadoPagoPaymentAdapter } from "@/lib/payment/adapters/mercadopago.adapter";
import type { PaymentMethod } from "@/lib/payment/ports/payment.port";

const logger = createLogger("api-create-order");

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 },
      );
    }

    const body = await request.json();

    const { planId, paymentMethod, cardToken, installments } = body;

    if (!planId || !paymentMethod) {
      return NextResponse.json(
        { error: "Dados de pagamento incompletos" },
        { status: 400 },
      );
    }

    if (paymentMethod === "credit_card" && !cardToken) {
      return NextResponse.json(
        { error: "Token de cartão obrigatório para pagamento com cartão" },
        { status: 400 },
      );
    }

    const [plan] = await db.select().from(plans).where(eq(plans.id, planId));

    if (!plan) {
      logger.error({ planId }, "Plano não encontrado");
      return NextResponse.json(
        { error: "Plano não encontrado" },
        { status: 404 },
      );
    }

    if (!plan.isActive) {
      logger.error({ planId }, "Plano não está ativo");
      return NextResponse.json(
        { error: "Plano não está disponível para compra" },
        { status: 400 },
      );
    }

    const externalReference = `${user.id.substring(0, 8)}-${planId.substring(0, 8)}-${Date.now()}`;

    const paymentAdapter = new MercadoPagoPaymentAdapter();

    logger.info(
      {
        userId: user.id,
        planId,
        paymentMethod,
        amount: plan.price,
        externalReference,
        externalReferenceLength: externalReference.length,
      },
      "Criando ordem de pagamento",
    );

    const orderResponse = await paymentAdapter.createOrder({
      planId: plan.id,
      totalAmount: plan.price,
      externalReference,
      payer: {
        email: user.email,
        firstName: user.name?.split(" ")[0],
        lastName: user.name?.split(" ").slice(1).join(" "),
      },
      paymentMethod: paymentMethod as PaymentMethod,
      cardToken,
      installments,
    });

    logger.info(
      {
        userId: user.id,
        orderId: orderResponse.orderId,
        status: orderResponse.status,
      },
      "Ordem criada com sucesso",
    );

    return NextResponse.json({
      success: true,
      order: orderResponse,
    });
  } catch (error) {
    logger.error({ error }, "Erro ao criar ordem de pagamento");

    return NextResponse.json(
      { error: "Erro ao processar pagamento" },
      { status: 500 },
    );
  }
}
