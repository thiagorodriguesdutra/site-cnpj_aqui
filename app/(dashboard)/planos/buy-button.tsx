"use client";

import { Icons } from "@/components/icons";

interface BuyButtonProps {
  planName: string;
  isLoading?: boolean;
  onClick?: () => void;
}

export function BuyButton({
  planName,
  isLoading = false,
  onClick,
}: BuyButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full h-10 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Icons.spinner className="h-4 w-4" />
          Processando...
        </>
      ) : (
        <>
          <Icons.coins className="h-4 w-4" />
          Comprar {planName}
        </>
      )}
    </button>
  );
}
