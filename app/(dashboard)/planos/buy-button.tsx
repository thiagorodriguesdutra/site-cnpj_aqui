"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Icons } from "@/components/icons";
import { events } from "@/lib/analytics/umami";

interface BuyButtonProps {
  planId: string;
  planName: string;
  price: string;
  credits?: number;
  isSubscription?: boolean;
  planType?: string;
}

export function BuyButton({
  planId,
  planName,
  price,
  credits,
  isSubscription = false,
  planType,
}: BuyButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Memoiza texto do botão para evitar recálculo em re-renders
  const buttonText = useMemo(() => {
    if (credits) {
      if (isSubscription) {
        return "Assinar agora";
      }
      return `Adicionar ${credits} créditos`;
    }
    return planName ? `Comprar ${planName}` : "Comprar agora";
  }, [credits, isSubscription, planName]);

  function handlePurchase() {
    setIsLoading(true);

    events.packageClicked(planId, Number(price));
    events.packageSelected(planId);

    const params = new URLSearchParams({
      planId,
      planName,
      credits: credits?.toString() || "0",
      price,
      ...(planType && { type: planType }),
    });

    router.push(`/checkout?${params.toString()}`);
  }

  return (
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
          {buttonText}
        </>
      )}
    </button>
  );
}
