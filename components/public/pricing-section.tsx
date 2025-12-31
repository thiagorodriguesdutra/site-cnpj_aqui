import { eq } from "drizzle-orm";
import { Icons } from "@/components/icons";
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";

export async function PublicPricingSection() {
  const activePlans = await db
    .select()
    .from(plans)
    .where(eq(plans.isActive, true))
    .orderBy(plans.price);

  const packagePlans = activePlans.filter((plan) => plan.type === "package");

  // Se não houver planos ativos, não renderiza nada
  if (packagePlans.length === 0) {
    return null;
  }

  // Encontra o plano destacado (50 créditos ou o do meio)
  const highlightedPlan =
    packagePlans.find((p) => p.credits === 50) ||
    packagePlans[Math.floor(packagePlans.length / 2)];

  return (
    <section id="planos" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Escolha seu pacote
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Plano Gratuito */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">Gratuito</h3>
              </div>
              <div>
                <div className="text-3xl font-bold">Grátis</div>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>3 consultas para testar</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Sem cartão de crédito</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Uso imediato</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>Histórico de consultas</span>
                </li>
              </ul>
              <a
                href="/login"
                className="w-full h-10 border border-border rounded-md hover:bg-accent transition-colors font-medium flex items-center justify-center"
              >
                Começar grátis
              </a>
            </div>

            {/* Planos Dinâmicos do Banco */}
            {packagePlans.slice(0, 2).map((plan) => {
              const isHighlighted = plan.id === highlightedPlan?.id;

              const benefits = [
                `${plan.credits} consultas`,
                "Pagamento único",
                "Créditos sem expiração",
                "Histórico completo",
              ];

              return (
                <div
                  key={plan.id}
                  className={`bg-card rounded-lg p-6 space-y-4 relative ${
                    isHighlighted
                      ? "border-2 border-primary"
                      : "border border-border"
                  }`}
                >
                  {isHighlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                      Mais popular
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      Pacote {plan.credits}
                    </h3>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">R$ {plan.price}</div>
                    <div className="text-sm text-muted-foreground">
                      pagamento único
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/login?from=/planos"
                    className={`w-full h-10 rounded-md transition-colors font-medium flex items-center justify-center ${
                      isHighlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-border hover:bg-accent"
                    }`}
                  >
                    Comprar pacote
                  </a>
                </div>
              );
            })}
          </div>

          <div className="mt-8 bg-card border border-border rounded-lg p-6">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-foreground">
                Pagamento via PIX
              </p>
              <p className="text-xs text-muted-foreground">
                Após a confirmação do pagamento, os créditos são liberados
                automaticamente para uso imediato.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
