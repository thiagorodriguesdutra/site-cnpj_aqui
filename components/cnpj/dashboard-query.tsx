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
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <Icons.alertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Sem créditos disponíveis
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Você precisa de créditos para realizar consultas de CNPJ
        </p>
      </div>
    );
  }

  return (
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
  );
}
