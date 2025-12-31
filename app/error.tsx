"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { createClientLogger } from "@/lib/logger/client";

const logger = createClientLogger("error-root");

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error(
      {
        error: error.message,
        digest: error.digest,
        stack: error.stack,
      },
      "Erro capturado pelo Error Boundary",
    );
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <Icons.alertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Algo deu errado
          </h1>
          <p className="text-muted-foreground">
            Ocorreu um erro inesperado. Tente novamente ou volte para a página
            inicial.
          </p>
        </div>

        {process.env.NODE_ENV === "development" && error.message && (
          <div className="bg-muted/50 border border-border rounded-lg p-4 text-left">
            <p className="text-xs font-mono text-destructive break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default">
            Tentar novamente
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Voltar para a página inicial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
