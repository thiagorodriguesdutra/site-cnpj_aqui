import { eq } from "drizzle-orm";
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
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { BuyButton } from "./buy-button";
import { PlansTracker } from "./plans-tracker";

export const metadata = {
  title: "Planos e Pacotes | CNPJ Aqui",
  description: "Escolha o plano ideal para suas necessidades",
};

export default async function PlanosPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?from=/planos");
  }

  const activePlans = await db
    .select()
    .from(plans)
    .where(eq(plans.isActive, true))
    .orderBy(plans.price);

  const packagePlans = activePlans.filter((plan) => plan.type === "package");
  const subscriptionPlans = activePlans.filter(
    (plan) => plan.type === "monthly" || plan.type === "yearly",
  );

  return (
    <div className="min-h-screen p-8 bg-background">
      <PlansTracker
        totalPlans={packagePlans.length + subscriptionPlans.length}
      />
      <div className="max-w-5xl mx-auto space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/painel">Painel</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Planos e Pacotes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Planos e Pacotes
          </h1>
          <p className="text-muted-foreground mt-2">
            Escolha a melhor opção para suas necessidades
          </p>
        </div>
        {packagePlans.length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Pacotes Avulsos
              </h2>
              <p className="text-sm text-muted-foreground">
                Pagamento único via PIX. Crédito liberado em segundos.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {packagePlans.map((plan) => {
                const isHighlighted = plan.credits === 50;
                return (
                  <div
                    key={plan.id}
                    className={`bg-card rounded-xl border p-6 shadow-sm space-y-4 transition-colors relative ${
                      isHighlighted
                        ? "border-primary border-2"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {isHighlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                          Melhor custo-benefício
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {plan.credits} consultas avulsas
                      </p>
                    </div>

                    <div>
                      <div className="text-3xl font-bold text-foreground">
                        R$ {plan.price}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        pagamento único
                      </p>
                    </div>

                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>Créditos sem expiração</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>Somados ao saldo atual</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>Acesso ilimitado ao histórico</span>
                      </li>
                    </ul>
                    <BuyButton planId={plan.id} planName={plan.name} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {subscriptionPlans.length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Assinaturas
              </h2>
              <p className="text-sm text-muted-foreground">
                Receba créditos mensais ou anuais. Melhor custo por consulta.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {subscriptionPlans.map((plan) => {
                const isHighlighted = plan.type === "yearly";
                return (
                  <div
                    key={plan.id}
                    className={`bg-card rounded-xl border p-6 shadow-sm space-y-4 transition-colors relative ${
                      isHighlighted
                        ? "border-primary border-2"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {isHighlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                          Melhor custo-benefício
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {plan.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {plan.credits} créditos{" "}
                        {plan.type === "monthly" ? "por mês" : "por ano"}
                      </p>
                    </div>

                    <div>
                      <div className="text-3xl font-bold text-foreground">
                        R$ {plan.price}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {plan.type === "monthly" ? "por mês" : "por ano"}
                      </p>
                    </div>

                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>Créditos sem expiração</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>Somados ao saldo atual</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>Acesso ilimitado ao histórico</span>
                      </li>
                    </ul>
                    <BuyButton planId={plan.id} planName={plan.name} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
