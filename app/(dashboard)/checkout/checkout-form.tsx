"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/icons";
import { events } from "@/lib/analytics/umami";
import { createClientLogger } from "@/lib/logger/client";

const logger = createClientLogger("checkout-form");

interface CheckoutFormProps {
  planId: string;
  planName: string;
  price: string;
  userEmail: string;
}

type PaymentMethod = "pix" | "credit_card";

export function CheckoutForm({
  planId,
  planName: _planName,
  price,
  userEmail: _userEmail,
}: CheckoutFormProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixData, setPixData] = useState<{
    qrCode?: string;
    qrCodeBase64?: string;
    ticketUrl?: string;
  } | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentTimestamp, setPaymentTimestamp] = useState<number | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!pixData || !paymentTimestamp) return;

    async function checkPaymentStatus() {
      try {
        const response = await fetch(
          `/api/payment/check-status?planId=${planId}&since=${paymentTimestamp}`,
        );

        if (!response.ok) return;

        const data = await response.json();

        if (data.paid) {
          setPaymentConfirmed(true);

          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          setTimeout(() => {
            router.push("/painel");
          }, 2000);
        }
      } catch (error) {
        logger.error(
          { error, planId },
          "Erro ao verificar status do pagamento",
        );
      }
    }

    pollingIntervalRef.current = setInterval(checkPaymentStatus, 3000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [pixData, paymentTimestamp, planId, router]);

  async function handlePixPayment() {
    setIsProcessing(true);
    setError(null);

    try {
      const timestamp = Date.now();

      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          paymentMethod: "pix",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pagamento");
      }

      if (data.order?.payments?.[0]?.paymentMethod) {
        const paymentMethodData = data.order.payments[0].paymentMethod;
        const orderId = data.order.orderId;

        setPixData({
          qrCode: paymentMethodData.qrCode,
          qrCodeBase64: paymentMethodData.qrCodeBase64,
          ticketUrl: paymentMethodData.ticketUrl,
        });

        setPaymentTimestamp(timestamp);

        events.checkoutViewed(orderId, planId, Number(price));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao processar pagamento";
      setError(errorMessage);
      events.paymentError("unknown", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleCardPayment(e: React.FormEvent) {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    setError("Pagamento com cartão em desenvolvimento. Use PIX por enquanto.");
    setIsProcessing(false);
  }

  if (paymentConfirmed) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-success/10 p-4 rounded-full animate-pulse">
              <Icons.check className="h-12 w-12 text-success" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              Pagamento Confirmado!
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              Seus créditos foram adicionados com sucesso
            </p>
          </div>
        </div>

        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-center gap-3 justify-center">
            <Icons.zap className="h-5 w-5 text-success shrink-0" />
            <p className="text-sm text-foreground font-medium">
              Redirecionando para o painel...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (pixData) {
    return (
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-success/10 p-3 rounded-full">
              <Icons.check className="h-8 w-8 text-success" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              QR Code PIX Gerado!
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Escaneie o código abaixo para pagar
            </p>
          </div>
        </div>

        {pixData.qrCodeBase64 && (
          <div className="flex justify-center">
            {/* biome-ignore lint/performance/noImgElement: base64 inline image for QR code */}
            <img
              src={`data:image/png;base64,${pixData.qrCodeBase64}`}
              alt="QR Code PIX"
              className="w-64 h-64 border-2 border-border rounded-lg"
            />
          </div>
        )}

        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">
            Instruções de pagamento:
          </p>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Abra o app do seu banco</li>
            <li>Escolha pagar com PIX QR Code</li>
            <li>Escaneie o código acima</li>
            <li>Confirme o pagamento de R$ {price}</li>
          </ol>
        </div>

        <div className="bg-info/10 border border-info/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Icons.info className="h-5 w-5 text-info shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">
                Aguardando confirmação do pagamento...
              </p>
              <p className="text-muted-foreground mt-1">
                Após pagar, você será redirecionado automaticamente. Não feche
                esta página.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => router.push("/painel")}
          className="w-full h-11 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
        >
          Voltar ao Painel
        </button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Forma de Pagamento
        </h2>
      </div>

      <div className="p-6 space-y-6">
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setPaymentMethod("pix")}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              paymentMethod === "pix"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "pix"
                    ? "border-primary"
                    : "border-muted-foreground"
                }`}
              >
                {paymentMethod === "pix" && (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground">PIX</div>
                <div className="text-sm text-muted-foreground">
                  Aprovação instantânea
                </div>
              </div>
              <Icons.zap className="h-5 w-5 text-success" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("credit_card")}
            className={`w-full p-4 rounded-lg border-2 transition-all ${
              paymentMethod === "credit_card"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "credit_card"
                    ? "border-primary"
                    : "border-muted-foreground"
                }`}
              >
                {paymentMethod === "credit_card" && (
                  <div className="w-3 h-3 rounded-full bg-primary" />
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-foreground">
                  Cartão de Crédito
                </div>
                <div className="text-sm text-muted-foreground">
                  Em até 12x sem juros
                </div>
              </div>
              <Icons.creditCard className="h-5 w-5 text-muted-foreground" />
            </div>
          </button>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icons.alertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {paymentMethod === "pix" && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">
                Como funciona:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Gere o QR Code PIX</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Pague no app do seu banco</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Créditos liberados automaticamente</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={handlePixPayment}
              disabled={isProcessing}
              className="w-full h-11 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Icons.spinner className="h-4 w-4 animate-spin" />
                  Gerando QR Code...
                </>
              ) : (
                <>
                  <Icons.qrCode className="h-5 w-5" />
                  Gerar QR Code PIX
                </>
              )}
            </button>
          </div>
        )}

        {paymentMethod === "credit_card" && (
          <form onSubmit={handleCardPayment} className="space-y-4">
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Icons.alertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">
                    Pagamento com cartão em desenvolvimento
                  </p>
                  <p className="text-muted-foreground mt-1">
                    Por enquanto, utilize PIX para realizar sua compra.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled
              className="w-full h-11 bg-muted text-muted-foreground rounded-lg font-semibold cursor-not-allowed"
            >
              <Icons.lock className="h-4 w-4 inline mr-2" />
              Em Breve
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
