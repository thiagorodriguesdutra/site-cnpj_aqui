import { eq } from "drizzle-orm";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DashboardQuery } from "@/components/cnpj/dashboard-query";
import { Icons } from "@/components/icons";
import { CreditBalanceSkeleton } from "@/components/ui/skeletons";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { userCredits } from "@/lib/db/schema";
import { DashboardTracker } from "./dashboard-tracker";

export const metadata = {
  title: "Painel | CNPJ Aqui",
  description: "Seu painel de controle",
};

async function CreditBadge({ userId }: { userId: string }) {
  const [credits] = await db
    .select()
    .from(userCredits)
    .where(eq(userCredits.userId, userId));

  const availableCredits = credits?.availableCredits || 0;

  return (
    <>
      <DashboardTracker availableCredits={availableCredits} />
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center justify-between gap-4 px-4 py-3 bg-card rounded-lg border border-border min-w-50">
          <div className="flex items-center gap-2">
            <Icons.zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {availableCredits} créditos
            </span>
          </div>
          <Link
            href="/uso"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Detalhes
            <Icons.chevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
      <DashboardQuery availableCredits={availableCredits} />
    </>
  );
}

export default async function PainelPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Olá, {user.name?.split(" ")[0] || user.email?.split("@")[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Consulte CNPJs e gere cartões oficiais em PDF
          </p>
        </div>

        <Suspense
          fallback={
            <>
              <CreditBalanceSkeleton />
              <div className="bg-card rounded-lg border border-border p-6 animate-pulse">
                <div className="h-6 w-48 bg-muted rounded mb-4" />
                <div className="h-12 w-full bg-muted rounded mb-4" />
                <div className="h-10 w-32 bg-muted rounded" />
              </div>
            </>
          }
        >
          <CreditBadge userId={user.id} />
        </Suspense>

        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/uso"
            className="bg-card rounded-lg border border-border p-5 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Icons.barChart className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Uso & Cobrança</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Histórico, plano e pagamentos
            </p>
            <Icons.chevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-2" />
          </Link>

          <Link
            href="/planos"
            className="bg-card rounded-lg border border-border p-5 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Icons.coins className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Planos</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Adquirir mais créditos ou assinar
            </p>
            <Icons.chevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-2" />
          </Link>

          <Link
            href="/conta"
            className="bg-card rounded-lg border border-border p-5 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Icons.settings className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Configurações</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Perfil e preferências
            </p>
            <Icons.chevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
