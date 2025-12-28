import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icons } from "@/components/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCurrentUser } from "@/lib/auth";
import {
  getCreditBalance,
  getCreditTransactions,
} from "@/lib/services/credits.service";
import { SuccessNotification } from "./success-notification";
import { UsageTracker } from "./usage-tracker";

export const metadata = {
  title: "Uso & Cobrança | CNPJ Aqui",
  description: "Gerencie seu uso, créditos e pagamentos",
};

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
      return "Bônus";
    case "refund":
      return "Reembolso";
    default:
      return type;
  }
}

export default async function UsoPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const balance = await getCreditBalance(user.id);
  const transactions = await getCreditTransactions(user.id, 10);

  const totalCredits = balance.availableCredits + balance.totalUsed;
  const usagePercentage =
    totalCredits > 0 ? Math.round((balance.totalUsed / totalCredits) * 100) : 0;

  return (
    <div className="min-h-screen p-8 bg-background">
      <UsageTracker
        availableCredits={balance.availableCredits}
        totalUsed={balance.totalUsed}
      />
      <div className="max-w-5xl mx-auto space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/painel">Painel</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Uso & Cobrança</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground">Uso & Cobrança</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus créditos e pagamentos
          </p>
        </div>

        <SuccessNotification />
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Créditos Disponíveis
              </p>
              <h2 className="text-4xl font-bold text-foreground">
                {balance.availableCredits}
              </h2>
            </div>
            <Link
              href="/planos"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
            >
              <Icons.plus className="w-4 h-4" />
              Adicionar
            </Link>
          </div>

          {totalCredits > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {balance.totalUsed} utilizados
                </span>
                <span className="text-muted-foreground">
                  {usagePercentage}% usado
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border border-border">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">
              Histórico de Transações
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Últimas {transactions.length} transações
            </p>
          </div>

          <div className="divide-y divide-border">
            {transactions.length === 0 ? (
              <div className="p-12 text-center">
                <Icons.activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Nenhuma transação ainda
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
                          {formatDistanceToNow(
                            new Date(transaction.createdAt),
                            {
                              addSuffix: true,
                              locale: ptBR,
                            },
                          )}
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
        </div>

        {balance.availableCredits === 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Icons.alertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Você está sem créditos
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Adquira mais créditos para continuar gerando cartões CNPJ
                </p>
                <Link
                  href="/planos"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Icons.coins className="w-4 h-4" />
                  Ver Planos
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
