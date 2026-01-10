import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Icons } from "@/components/icons";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TransactionListSkeleton } from "@/components/ui/skeletons";
import { getCurrentUser } from "@/lib/auth";
import {
  getCreditBalance,
  getCreditTransactionsPaginated,
} from "@/lib/services/credits.service";
import { SuccessNotification } from "./success-notification";
import { TransactionList } from "./transaction-list";
import { UsageTracker } from "./usage-tracker";

export const metadata = {
  title: "Uso & Cobrança | CNPJ Aqui",
  description: "Gerencie seu uso, créditos e pagamentos",
};

async function CreditBalance({ userId }: { userId: string }) {
  const balance = await getCreditBalance(userId);
  const totalCredits = balance.availableCredits + balance.totalUsed;
  const usagePercentage =
    totalCredits > 0 ? Math.round((balance.totalUsed / totalCredits) * 100) : 0;

  return (
    <>
      <UsageTracker
        availableCredits={balance.availableCredits}
        totalUsed={balance.totalUsed}
      />
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
    </>
  );
}

interface TransactionListWrapperProps {
  userId: string;
  page: number;
  pageSize: number;
}

async function TransactionListWrapper({
  userId,
  page,
  pageSize,
}: TransactionListWrapperProps) {
  const data = await getCreditTransactionsPaginated(userId, page, pageSize);

  return (
    <TransactionList
      transactions={data.transactions}
      total={data.total}
      page={data.page}
      pageSize={data.pageSize}
    />
  );
}

function CreditBalanceSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 space-y-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div>
          <div className="h-4 w-32 bg-muted rounded mb-2" />
          <div className="h-10 w-16 bg-muted rounded" />
        </div>
        <div className="h-10 w-28 bg-muted rounded" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="h-2 w-full bg-muted rounded-full" />
      </div>
    </div>
  );
}

interface UsoPageProps {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}

export default async function UsoPage({ searchParams }: UsoPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.min(100, Math.max(10, Number(params.pageSize) || 25));

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb e titulo renderizam imediatamente (LCP) */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/painel">Painel</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Uso e Cobranca</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground">Uso e Cobranca</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus creditos e pagamentos
          </p>
        </div>

        <SuccessNotification />

        {/* Suspense para o saldo - permite streaming */}
        <Suspense fallback={<CreditBalanceSkeleton />}>
          <CreditBalance userId={user.id} />
        </Suspense>

        {/* Suspense para transacoes - carrega em paralelo */}
        <Suspense fallback={<TransactionListSkeleton />}>
          <TransactionListWrapper
            userId={user.id}
            page={page}
            pageSize={pageSize}
          />
        </Suspense>
      </div>
    </div>
  );
}
