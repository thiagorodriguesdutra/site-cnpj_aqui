import { eq } from "drizzle-orm";
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
import { db } from "@/lib/db";
import { plans } from "@/lib/db/schema";
import { CheckoutForm } from "./checkout-form";

export const metadata = {
  title: "Checkout | CNPJ Aqui",
  description: "Finalize sua compra",
};

interface PageProps {
  searchParams: Promise<{
    planId?: string;
    planName?: string;
    credits?: string;
    price?: string;
    type?: string;
  }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?from=/planos");
  }

  const params = await searchParams;
  const { planId, planName, credits, price, type } = params;

  if (!planId || !planName || !credits || !price) {
    redirect("/planos");
  }

  const [plan] = await db.select().from(plans).where(eq(plans.id, planId));

  if (!plan || !plan.isActive) {
    redirect("/planos");
  }

  const isSubscription = type === "monthly" || type === "yearly";
  const pricePerCredit = (Number(price) / Number(credits)).toFixed(2);

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/painel">Painel</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/planos">Planos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Checkout</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Finalize sua compra
          </h1>
          <p className="text-muted-foreground mt-1">
            Escolha a forma de pagamento e conclua sua compra
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border shadow-sm">
              <div className="p-6 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">
                  Resumo da Compra
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">{planName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isSubscription
                      ? `Plano ${type === "monthly" ? "Mensal" : "Anual"}`
                      : "Pacote Avulso"}
                  </p>
                </div>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>{credits} créditos</strong> para consultas CNPJ
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>R$ {pricePerCredit} por consulta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Re-download grátis no mesmo dia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Créditos sem expiração</span>
                  </li>
                </ul>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Créditos</span>
                    <span className="font-medium">{credits} créditos</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-muted-foreground">Valor</span>
                    <span className="font-medium">R$ {price}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-foreground">
                      R$ {price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/planos"
              className="flex items-center justify-center gap-2 h-11 px-6 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
            >
              <Icons.arrowLeft className="h-4 w-4" />
              Voltar aos Planos
            </Link>
          </div>

          <div>
            <CheckoutForm
              planId={planId}
              planName={planName}
              price={price}
              userEmail={user.email}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
