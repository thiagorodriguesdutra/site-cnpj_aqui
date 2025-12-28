import { redirect } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCurrentUser, getUserProviders } from "@/lib/auth";

export const metadata = {
  title: "Minha Conta | CNPJ Aqui",
  description: "Gerencie sua conta e configurações",
};

export default async function ContaPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const providers = await getUserProviders(user.id);

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/painel">Painel</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Minha Conta</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Minha Conta</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações e configurações
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Informações Pessoais
            </h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  Nome
                </dt>
                <dd className="mt-1 text-foreground">
                  {user.name || "Não informado"}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">
                  E-mail
                </dt>
                <dd className="mt-1 text-foreground">{user.email}</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Métodos de Login
            </h2>
            <div className="space-y-2">
              {providers.includes("google") ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                    Google
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    Magic Link (E-mail)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
