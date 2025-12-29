"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { events } from "@/lib/analytics/umami";
import type { CnpjData } from "@/lib/services/cnpj.service";
import { QueryForm } from "./query-form";
import { QueryResult } from "./query-result";

interface DashboardQueryProps {
  availableCredits: number;
}

export function DashboardQuery({ availableCredits }: DashboardQueryProps) {
  const [result, setResult] = useState<CnpjData | null>(null);
  const [trackedNoCredits, setTrackedNoCredits] = useState(false);

  useEffect(() => {
    if (availableCredits === 0 && !trackedNoCredits) {
      events.creditsDepleted(false);
      setTrackedNoCredits(true);
    }
  }, [availableCredits, trackedNoCredits]);

  function handleSuccess(data: CnpjData, _creditsRemaining: number) {
    setResult(data);
  }

  function handleNewQuery() {
    setResult(null);
  }

  if (availableCredits === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
          <Icons.alertCircle className="w-8 h-8 text-warning" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Sem créditos disponíveis
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Você precisa de créditos para realizar consultas de CNPJ e gerar
          cartões oficiais em PDF
        </p>
        <a
          href="/planos"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Icons.coins className="w-5 h-5" />
          Ver Planos e Adquirir Créditos
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {availableCredits > 0 && availableCredits <= 2 && (
        <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Icons.alertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Poucos créditos restantes
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Você tem apenas {availableCredits}{" "}
                {availableCredits === 1 ? "crédito" : "créditos"} disponível
                {availableCredits === 1 ? "" : "is"}. Adquira mais para não
                ficar sem acesso.
              </p>
              <a
                href="/planos"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Icons.coins className="w-4 h-4" />
                Adicionar Créditos
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border shadow-md overflow-hidden">
        <div className="bg-linear-to-r from-primary/5 to-primary/10 p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icons.search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Consultar CNPJ
              </h2>
              <p className="text-sm text-muted-foreground">
                Digite o CNPJ para gerar o cartão oficial em PDF
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {result ? (
            <QueryResult data={result} onNew={handleNewQuery} />
          ) : (
            <QueryForm onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}
