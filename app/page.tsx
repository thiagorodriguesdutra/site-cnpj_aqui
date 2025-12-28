import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { HeroSearchInput } from "@/components/hero-search-input";
import { Icons } from "@/components/icons";
import { PublicFooter } from "@/components/public/footer";
import { PublicHeader } from "@/components/public/header";
import { getCurrentUser } from "@/lib/auth";
import { publicEnv } from "@/lib/env.public";

const appUrl = publicEnv.NEXT_PUBLIC_APP_URL || "https://www.cnpjfacil.com.br";

export const metadata: Metadata = {
  title: "CNPJ Aqui - Emita o Cartão CNPJ Oficial em PDF em 2 segundos",
  description:
    "Gere PDFs oficiais com QR Code de verificação. Ideal para contadores, cartórios e bancos. Sem burocracia.",
  keywords: [
    "cartão cnpj",
    "gerar cartão cnpj",
    "cnpj pdf",
    "consulta cnpj",
    "receita federal",
    "comprovante cnpj",
    "cnpj online",
    "mei",
    "contador",
  ],
  authors: [{ name: "CNPJ Aqui" }],
  creator: "CNPJ Aqui",
  publisher: "CNPJ Aqui",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: appUrl,
    title: "CNPJ Aqui - Emita o Cartão CNPJ Oficial em PDF em 2 segundos",
    description:
      "Gere PDFs oficiais com QR Code de verificação. Ideal para contadores, cartórios e bancos. Sem burocracia.",
    siteName: "CNPJ Aqui",
    images: [
      {
        url: `${appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CNPJ Aqui - Gere o Cartão CNPJ em segundos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CNPJ Aqui - Emita o Cartão CNPJ Oficial em PDF em 2 segundos",
    description:
      "Gere PDFs oficiais com QR Code de verificação. Ideal para contadores, cartórios e bancos. Sem burocracia.",
    images: [`${appUrl}/og-image.png`],
  },
  alternates: {
    canonical: appUrl,
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default async function Home() {
  const user = await getCurrentUser();

  // Redireciona usuários logados para o painel
  if (user) {
    redirect("/painel");
  }

  return (
    <div className="min-h-screen">
      <PageViewTracker />
      <PublicHeader />

      <main>
        <section className="py-16 md:py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Cartão CNPJ oficial em PDF,{" "}
                  <span className="text-primary">pronto em segundos</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Dados oficiais da Receita Federal, com QR Code de verificação.
                  Documento aceito em bancos, cartórios e empresas.
                </p>
              </div>

              <HeroSearchInput />

              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <Icons.checkCircle className="w-4 h-4 text-primary" />
                  <span>Dados Oficiais</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.qrCode className="w-4 h-4 text-primary" />
                  <span>QR Code de Autenticidade</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.building className="w-4 h-4 text-primary" />
                  <span>Aceito em Bancos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  O jeito mais rápido de emitir Cartão CNPJ
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icons.zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Rapidez</h3>
                  <p className="text-sm text-muted-foreground">
                    Consulta imediata e PDF pronto na hora, sem espera, sem
                    captcha e sem instabilidade.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icons.shield className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Confiável</h3>
                  <p className="text-sm text-muted-foreground">
                    Informações oficiais consultadas diretamente da base da
                    Receita Federal, sempre atualizadas.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icons.fileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Prático</h3>
                  <p className="text-sm text-muted-foreground">
                    PDF pronto para baixar, imprimir ou compartilhar sempre que
                    precisar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Simples e direto
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="relative">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                      1
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Digite o CNPJ que você precisa consultar.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                      2
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Buscamos os dados oficiais e geramos o Cartão CNPJ em PDF
                      automaticamente.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                      3
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Baixe, imprima ou compartilhe o documento na hora.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Feito para quem precisa de agilidade
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.briefcase className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Contadores</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Emissão recorrente de Cartões CNPJ para clientes.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.building className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Escritórios e assessorias</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Atendimento diário a múltiplas empresas.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.users className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">MEIs e pequenas empresas</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Comprovante rápido para bancos e fornecedores.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.fileText className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Prestadores de serviço PJ</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uso frequente em contratos, cadastros e validações.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-linear-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      <Icons.shield className="w-4 h-4" />
                      Confiável
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      Documento confiável para uso profissional
                    </h2>
                    <p className="text-muted-foreground">
                      Nosso Cartão CNPJ é o único com QR Code para validação
                      online.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="font-medium">
                        Dados públicos oficiais sempre atualizados
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="font-medium">
                        Layout padronizado e profissional
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="font-medium">
                        Aceito como comprovante por bancos, cartórios e empresas
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-lg">
                    Histórico completo no seu painel
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Todas as consultas ficam salvas. Você pode acessar e baixar
                    novamente qualquer Cartão CNPJ emitido sem gastar novos
                    créditos.
                  </p>
                </div>
                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <h3 className="font-semibold text-lg">
                    Pague apenas pelo que usar
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sem mensalidade e sem compromisso. Você compra créditos por
                    consulta, usa quando quiser e eles não expiram.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="planos" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Escolha seu pacote
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
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

                <div className="bg-card border-2 border-primary rounded-lg p-6 space-y-4 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                    Mais popular
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Pacote 20</h3>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">R$ 4,90</div>
                    <div className="text-sm text-muted-foreground">
                      pagamento único
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>20 consultas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Pagamento único</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Créditos sem expiração</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Histórico completo</span>
                    </li>
                  </ul>
                  <a
                    href="/login?from=/planos"
                    className="w-full h-10 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium flex items-center justify-center"
                  >
                    Comprar pacote
                  </a>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Pacote 100</h3>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">R$ 14,90</div>
                    <div className="text-sm text-muted-foreground">
                      pagamento único
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>100 consultas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Pagamento único</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Créditos sem expiração</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Histórico completo</span>
                    </li>
                  </ul>
                  <a
                    href="/login?from=/planos"
                    className="w-full h-10 border border-border rounded-md hover:bg-accent transition-colors font-medium flex items-center justify-center"
                  >
                    Comprar pacote
                  </a>
                </div>
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

        <section id="faq" className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Dúvidas frequentes
                </h2>
              </div>

              <div className="space-y-4">
                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    O Cartão CNPJ gerado é válido como comprovante?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Sim. O documento utiliza dados oficiais da Receita Federal,
                    possui QR Code de verificação e é aceito como comprovante em
                    bancos, cartórios e empresas.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Os dados consultados são oficiais e atualizados?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Sim. Cada consulta busca as informações mais recentes
                    disponíveis na base oficial no momento da emissão.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Preciso pagar mensalidade para usar?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Não. O modelo é por créditos. Você paga apenas pelas
                    consultas que fizer, sem mensalidade.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    As consultas ficam salvas para acesso futuro?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Sim. Todas as consultas ficam salvas no seu painel e podem
                    ser acessadas novamente sem gastar novos créditos.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Como funciona o pagamento dos pacotes?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    O pagamento é feito via PIX e os créditos são liberados
                    automaticamente após a confirmação.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Os créditos têm data de expiração?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Não. Os créditos não expiram e podem ser usados quando você
                    precisar.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Posso comprar mais de um pacote?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Sim. Os créditos de diferentes pacotes são acumulados no seu
                    saldo total.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-linear-to-br from-primary/10 to-accent/10">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Precisa do Cartão CNPJ agora?
              </h2>
              <p className="text-lg text-muted-foreground">
                Comece com 3 consultas gratuitas e veja como é simples emitir
                seu Cartão CNPJ em PDF.
              </p>
              <a
                href="/login"
                className="h-12 px-8 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                Consultar CNPJ grátis
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
