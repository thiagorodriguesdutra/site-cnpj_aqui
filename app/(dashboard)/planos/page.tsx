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

        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Escolha seu plano ideal
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Créditos sem expiração. Somados ao seu saldo atual. Use quando
            quiser.
          </p>
        </div>

        {packagePlans.length === 0 && subscriptionPlans.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Icons.alertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum plano disponível no momento
            </h3>
            <p className="text-sm text-muted-foreground">
              Estamos atualizando nossos planos. Volte em breve.
            </p>
          </div>
        )}

        {packagePlans.length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Pacotes Avulsos
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Compra única. Créditos liberados instantaneamente.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {packagePlans.map((plan) => {
                const isHighlighted = plan.credits === 50;
                const pricePerCredit = (
                  Number(plan.price) / plan.credits
                ).toFixed(2);

                let description = "";
                let benefits: string[] = [];

                if (plan.credits === 5) {
                  description = "Ideal para testes ou uso pontual";
                  benefits = [
                    `R$ ${pricePerCredit} por consulta`,
                    "Re-download grátis no mesmo dia",
                    "Válido indefinidamente",
                  ];
                } else if (plan.credits === 50) {
                  description = "Ideal para consultas frequentes";
                  benefits = [
                    `R$ ${pricePerCredit} por consulta`,
                    "Economia de 30% vs pacote menor",
                    "Re-download grátis no mesmo dia",
                  ];
                } else if (plan.credits === 100) {
                  description = "Para uso intenso ou empresas";
                  benefits = [
                    `R$ ${pricePerCredit} por consulta`,
                    "Menor custo por consulta",
                    "Re-download grátis no mesmo dia",
                  ];
                } else {
                  description = `${plan.credits} consultas de CNPJ`;
                  benefits = [
                    `R$ ${pricePerCredit} por consulta`,
                    "Re-download grátis no mesmo dia",
                    "Válido indefinidamente",
                  ];
                }

                return (
                  <div
                    key={plan.id}
                    className={`bg-card rounded-xl border p-6 shadow-sm space-y-4 transition-all relative ${
                      isHighlighted
                        ? "border-primary border-2 shadow-lg scale-105"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {isHighlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          Mais popular
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {plan.credits} Créditos
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">
                          R$ {plan.price}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        R$ {pricePerCredit} por consulta
                      </p>
                    </div>

                    <ul className="space-y-2 text-sm">
                      {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2">
                          <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <BuyButton
                      planId={plan.id}
                      planName=""
                      price={plan.price}
                      credits={plan.credits}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {subscriptionPlans.length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Planos de Assinatura
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Receba créditos regularmente com o menor custo por consulta.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {subscriptionPlans.map((plan) => {
                const isHighlighted = plan.type === "monthly";
                const pricePerCredit = (
                  Number(plan.price) / plan.credits
                ).toFixed(2);

                let description = "";
                let benefits: string[] = [];
                let badge = "";

                if (plan.type === "monthly") {
                  description = "Para quem usa toda semana";
                  badge = "Recomendado";
                  benefits = [
                    "120 créditos por mês",
                    "R$ 0,33 por consulta",
                    "Ideal para uso regular",
                  ];
                } else if (plan.type === "yearly") {
                  description = "Para uso diário com economia máxima";
                  badge = "Maior economia";
                  benefits = [
                    "1.800 créditos por ano",
                    "R$ 0,22 por consulta",
                    "Economize 33% vs mensal",
                  ];
                }

                return (
                  <div
                    key={plan.id}
                    className={`bg-card rounded-xl border p-6 shadow-sm space-y-4 transition-all relative ${
                      isHighlighted
                        ? "border-primary border-2 shadow-lg scale-105"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          {badge}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {plan.type === "monthly" ? "Mensal" : "Anual"}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-foreground">
                          R$ {plan.price}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /{plan.type === "monthly" ? "mês" : "ano"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {plan.credits} créditos · R$ {pricePerCredit} por
                        consulta
                      </p>
                    </div>

                    <ul className="space-y-2 text-sm">
                      {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2">
                          <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <BuyButton
                      planId={plan.id}
                      planName=""
                      price={plan.price}
                      credits={plan.credits}
                      isSubscription
                    />
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
