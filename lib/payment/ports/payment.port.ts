export type PaymentMethod = "pix" | "credit_card";

export type PaymentStatus =
  | "pending"
  | "action_required"
  | "processed"
  | "failed"
  | "cancelled";

export interface PaymentPayer {
  email: string;
  firstName?: string;
  lastName?: string;
  identification?: {
    type: string;
    number: string;
  };
}

export interface CreateOrderRequest {
  planId: string;
  totalAmount: string;
  externalReference: string;
  payer: PaymentPayer;
  paymentMethod: PaymentMethod;
  cardToken?: string;
  installments?: number;
}

export interface PaymentMethodInfo {
  id: string;
  type: string;
  qrCode?: string;
  qrCodeBase64?: string;
  ticketUrl?: string;
}

export interface PaymentInfo {
  id: string;
  status: PaymentStatus;
  statusDetail: string;
  amount: string;
  paymentMethod: PaymentMethodInfo;
}

export interface CreateOrderResponse {
  orderId: string;
  status: PaymentStatus;
  statusDetail: string;
  totalAmount: string;
  externalReference: string;
  payments: PaymentInfo[];
}

export interface GetOrderResponse {
  orderId: string;
  status: PaymentStatus;
  statusDetail: string;
  totalAmount: string;
  externalReference: string;
  payments: PaymentInfo[];
}

export interface IPaymentPort {
  createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse>;
  getOrder(orderId: string): Promise<GetOrderResponse>;
  verifyWebhookSignature?(payload: string, signature: string): boolean;
}
