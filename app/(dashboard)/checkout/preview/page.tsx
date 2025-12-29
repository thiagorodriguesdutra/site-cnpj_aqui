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

export const metadata = {
  title: "Checkout Preview | CNPJ Aqui",
  description: "Preview do fluxo de checkout",
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

export default async function CheckoutPreviewPage({ searchParams }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?from=/planos");
  }

  const params = await searchParams;
  const { planName, credits, price, type } = params;

  if (!planName || !credits || !price) {
    redirect("/planos");
  }

  const isSubscription = type === "monthly" || type === "yearly";
  const pricePerCredit = (Number(price) / Number(credits)).toFixed(2);

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-3xl mx-auto space-y-8">
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

        <div className="bg-info/10 border border-info/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Icons.info className="h-5 w-5 text-info shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Preview do Fluxo de Checkout
              </h3>
              <p className="text-sm text-muted-foreground">
                Esta é uma visualização de como será o processo de pagamento. O
                pagamento ainda não está disponível.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Resumo da Compra
          </h1>
          <p className="text-muted-foreground mt-1">
            Confira os detalhes do seu plano
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {planName}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {isSubscription
                    ? `Plano ${type === "monthly" ? "Mensal" : "Anual"}`
                    : "Pacote Avulso"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">
                  R$ {price}
                </div>
                {isSubscription && (
                  <p className="text-sm text-muted-foreground">
                    /{type === "monthly" ? "mês" : "ano"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                O que está incluído
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    <strong>{credits} créditos</strong> para consultas CNPJ
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>R$ {pricePerCredit} por consulta</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Re-download grátis no mesmo dia</span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <Icons.check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Créditos sem expiração</span>
                </li>
              </ul>
            </div>

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

        <div className="bg-warning/10 border border-warning/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Icons.alertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Pagamento ainda não disponível
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                O sistema de pagamento está em desenvolvimento. Quando for
                liberado, você receberá um aviso e poderá concluir sua compra.
              </p>
              <p className="text-sm text-muted-foreground">
                Por enquanto, este é apenas um preview do fluxo de checkout para
                validação da experiência do usuário.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/planos"
            className="flex-1 h-11 px-6 border border-border rounded-lg hover:bg-muted transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Icons.arrowLeft className="h-4 w-4" />
            Voltar aos Planos
          </Link>
          <button
            type="button"
            disabled
            className="flex-1 h-11 px-6 bg-muted text-muted-foreground rounded-lg font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <Icons.lock className="h-4 w-4" />
            Pagamento em Breve
          </button>
        </div>
      </div>
    </div>
  );
}
