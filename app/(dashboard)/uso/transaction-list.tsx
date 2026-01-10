"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Icons } from "@/components/icons";
import { Pagination } from "@/components/ui/pagination";
import type { CreditTransaction } from "@/lib/db/schema";
import { createClientLogger } from "@/lib/logger/client";

const logger = createClientLogger("transaction-list");

interface TransactionListProps {
  transactions: CreditTransaction[];
  total: number;
  page: number;
  pageSize: number;
}

function getTransactionIcon(type: string) {
  switch (type) {
    case "usage":
      return <Icons.arrowDown className="h-4 w-4 text-destructive" />;
    case "purchase":
      return <Icons.arrowUp className="h-4 w-4 text-success" />;
    case "bonus":
      return <Icons.gift className="h-4 w-4 text-primary" />;
    case "refund":
      return <Icons.arrowUp className="h-4 w-4 text-info" />;
    default:
      return <Icons.circle className="h-4 w-4 text-muted-foreground" />;
  }
}

function getTransactionLabel(type: string) {
  switch (type) {
    case "usage":
      return "Uso";
    case "purchase":
      return "Compra";
    case "bonus":
      return "Bonus";
    case "refund":
      return "Reembolso";
    default:
      return type;
  }
}

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "agora";
  if (diffMins < 60) return `ha ${diffMins} min`;
  if (diffHours < 24) return `ha ${diffHours}h`;
  if (diffDays === 1) return "ontem";
  if (diffDays < 7) return `ha ${diffDays} dias`;
  if (diffDays < 30) return `ha ${Math.floor(diffDays / 7)} sem`;
  if (diffDays < 365) return `ha ${Math.floor(diffDays / 30)} meses`;
  return `ha ${Math.floor(diffDays / 365)} anos`;
}

export function TransactionList({
  transactions,
  total,
  page,
  pageSize,
}: TransactionListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = useCallback(
    (newPage: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));

      logger.debug({ newPage, total }, "Navegando para pagina");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, total],
  );

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("pageSize", String(newSize));
      params.set("page", "1");

      logger.debug({ newSize }, "Alterando tamanho da pagina");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Historico de Transacoes
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {total === 0
            ? "Nenhuma transacao"
            : `${total} transaco${total === 1 ? "" : "es"} no total`}
        </p>
      </div>

      <div className="divide-y divide-border">
        {transactions.length === 0 ? (
          <div className="p-12 text-center">
            <Icons.activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Nenhuma transacao ainda
            </p>
          </div>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(new Date(transaction.createdAt))}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${
                      transaction.amount > 0
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                    {getTransactionLabel(transaction.type)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {total > 0 && (
        <div className="p-4 border-t border-border">
          <Pagination
            currentPage={page}
            totalItems={total}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 25, 50]}
            itemLabel="transacoes"
          />
        </div>
      )}
    </div>
  );
}
