"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { purchasePlan } from "@/app/_actions/plans/purchase";
import { Icons } from "@/components/icons";

interface BuyButtonProps {
  planId: string;
  planName: string;
  credits?: number;
  isSubscription?: boolean;
}

export function BuyButton({
  planId,
  planName,
  credits,
  isSubscription = false,
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();

  async function handlePurchase() {
    setIsLoading(true);
    setError(null);

    try {
      const result = await purchasePlan(planId);

      startTransition(() => {
        router.push(
          `/uso?success=true&credits=${result.creditsAdded}&plan=${encodeURIComponent(result.planName)}`,
        );
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao processar compra",
      );
      setIsLoading(false);
    }
  }

  const getButtonText = () => {
    if (isLoading) return "Processando...";

    if (credits) {
      if (isSubscription) {
        return "Assinar agora";
      }
      return `Adicionar ${credits} créditos`;
    }

    return planName ? `Comprar ${planName}` : "Comprar agora";
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handlePurchase}
        disabled={isLoading}
        className="w-full h-11 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {isLoading ? (
          <>
            <Icons.spinner className="h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Icons.coins className="h-5 w-5" />
            {getButtonText()}
          </>
        )}
      </button>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  );
}
