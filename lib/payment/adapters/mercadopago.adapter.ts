import { MercadoPagoConfig, Order } from "mercadopago";
import { createLogger } from "@/lib/logger";
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  GetOrderResponse,
  IPaymentPort,
  PaymentStatus,
} from "../ports/payment.port";

const logger = createLogger("mercadopago-adapter");

export class MercadoPagoPaymentAdapter implements IPaymentPort {
  private client: MercadoPagoConfig;
  private orderApi: Order;

  constructor() {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("MERCADOPAGO_ACCESS_TOKEN não configurado");
    }

    this.client = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 10000 },
    });

    this.orderApi = new Order(this.client);

    logger.info("Adapter do Mercado Pago inicializado");
  }

  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const paymentMethodConfig =
        request.paymentMethod === "pix"
          ? {
              id: "pix",
              type: "bank_transfer",
            }
          : {
              id: this.extractCardBrandFromToken(request.cardToken || ""),
              type: "credit_card",
              token: request.cardToken,
              installments: request.installments || 1,
            };

      const body = {
        type: "online" as const,
        processing_mode: "automatic" as const,
        total_amount: request.totalAmount,
        external_reference: request.externalReference,
        payer: {
          email: request.payer.email,
          ...(request.payer.firstName && {
            first_name: request.payer.firstName,
          }),
          ...(request.payer.lastName && { last_name: request.payer.lastName }),
          ...(request.payer.identification && {
            identification: {
              type: request.payer.identification.type,
              number: request.payer.identification.number,
            },
          }),
        },
        transactions: {
          payments: [
            {
              amount: request.totalAmount,
              payment_method: paymentMethodConfig,
            },
          ],
        },
      };

      const requestOptions = {
        idempotencyKey: `order-${request.externalReference}-${Date.now()}`,
      };

      logger.info(
        {
          externalReference: request.externalReference,
          planId: request.planId,
          paymentMethod: request.paymentMethod,
        },
        "Criando order no Mercado Pago",
      );

      const response = await this.orderApi.create({ body, requestOptions });

      const mappedResponse: CreateOrderResponse = {
        orderId: response.id?.toString() || "",
        status: this.mapStatus(response.status),
        statusDetail: response.status_detail || "",
        totalAmount: response.total_amount || "0",
        externalReference: response.external_reference || "",
        payments:
          response.transactions?.payments?.map((payment) => ({
            id: payment.id?.toString() || "",
            status: this.mapStatus(payment.status),
            statusDetail: payment.status_detail || "",
            amount: payment.amount || "0",
            paymentMethod: {
              id: payment.payment_method?.id || "",
              type: payment.payment_method?.type || "",
              qrCode: payment.payment_method?.qr_code,
              qrCodeBase64: payment.payment_method?.qr_code_base64,
              ticketUrl: payment.payment_method?.ticket_url,
            },
          })) || [],
      };

      logger.info(
        {
          orderId: mappedResponse.orderId,
          status: mappedResponse.status,
          paymentMethod: request.paymentMethod,
        },
        "Order criada com sucesso",
      );

      return mappedResponse;
    } catch (error) {
      logger.error(
        {
          error,
          planId: request.planId,
          paymentMethod: request.paymentMethod,
        },
        "Erro ao criar order no Mercado Pago",
      );
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<GetOrderResponse> {
    try {
      logger.info({ orderId }, "Consultando order no Mercado Pago");

      const response = await this.orderApi.get({ id: orderId });

      const mappedResponse: GetOrderResponse = {
        orderId: response.id?.toString() || "",
        status: this.mapStatus(response.status),
        statusDetail: response.status_detail || "",
        totalAmount: response.total_amount || "0",
        externalReference: response.external_reference || "",
        payments:
          response.transactions?.payments?.map((payment) => ({
            id: payment.id?.toString() || "",
            status: this.mapStatus(payment.status),
            statusDetail: payment.status_detail || "",
            amount: payment.amount || "0",
            paymentMethod: {
              id: payment.payment_method?.id || "",
              type: payment.payment_method?.type || "",
              qrCode: payment.payment_method?.qr_code,
              qrCodeBase64: payment.payment_method?.qr_code_base64,
              ticketUrl: payment.payment_method?.ticket_url,
            },
          })) || [],
      };

      logger.info(
        { orderId, status: mappedResponse.status },
        "Order consultada com sucesso",
      );

      return mappedResponse;
    } catch (error) {
      logger.error({ error, orderId }, "Erro ao consultar order");
      throw error;
    }
  }

  verifyWebhookSignature(_payload: string, signature: string): boolean {
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

    if (!secret) {
      logger.warn("MERCADOPAGO_WEBHOOK_SECRET não configurado");
      return false;
    }

    return signature === secret;
  }

  private mapStatus(status: string | undefined): PaymentStatus {
    if (!status) return "pending";

    const statusMap: Record<string, PaymentStatus> = {
      created: "pending",
      action_required: "action_required",
      processed: "processed",
      failed: "failed",
      cancelled: "cancelled",
      pending: "pending",
    };

    return statusMap[status] || "pending";
  }

  private extractCardBrandFromToken(_token: string): string {
    return "master";
  }
}
