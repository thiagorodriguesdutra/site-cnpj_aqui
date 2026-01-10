import type { Metadata } from "next";
import { PageViewTracker } from "@/components/analytics/page-view-tracker";
import { HeroSearchInput } from "@/components/hero-search-input";
import { Icons } from "@/components/icons";
import { PublicFooter } from "@/components/public/footer";
import { PublicHeader } from "@/components/public/header";
import { PublicPricingSection } from "@/components/public/pricing-section";
import { publicEnv } from "@/lib/env.public";

const appUrl = publicEnv.NEXT_PUBLIC_APP_URL || "https://www.cnpjfacil.com.br";

// Página estática - redirect de usuários autenticados é feito no middleware
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "CNPJ Aqui — Cartão CNPJ organizado para uso profissional",
  description:
    "Consulte, organize e apresente dados do CNPJ sem dor de cabeça. Dados públicos da Receita Federal em PDF fácil de usar.",
  keywords: [
    "cartão cnpj",
    "consulta cnpj",
    "cnpj pdf",
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
    title: "CNPJ Aqui — Cartão CNPJ organizado para uso profissional",
    description:
      "Consulte, organize e apresente dados do CNPJ sem dor de cabeça. Dados públicos da Receita Federal em PDF fácil de usar.",
    siteName: "CNPJ Aqui",
    images: [
      {
        url: `${appUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CNPJ Aqui - Cartão CNPJ organizado para uso profissional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CNPJ Aqui — Cartão CNPJ organizado para uso profissional",
    description:
      "Consulte, organize e apresente dados do CNPJ sem dor de cabeça. Dados públicos da Receita Federal em PDF fácil de usar.",
    images: [`${appUrl}/og-image.png`],
  },
  alternates: {
    canonical: appUrl,
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function Home() {
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
                  Cartão CNPJ organizado para{" "}
                  <span className="text-primary">
                    banco, contrato e cadastro
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Consulte e apresente dados do CNPJ sem perder tempo nem passar
                  aperto.
                </p>
              </div>

              <HeroSearchInput />

              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <Icons.building className="w-4 h-4 text-primary" />
                  <span>Dados públicos da Receita Federal</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.qrCode className="w-4 h-4 text-primary" />
                  <span>QR Code para conferência</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.checkCircle className="w-4 h-4 text-primary" />
                  <span>Teste grátis</span>
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
                  Por que isso existe?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  O documento oficial existe. O problema começa quando você
                  precisa usar ele.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icons.zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    Consulta rápida, sem travar
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Nada de captcha, erro ou ficar tentando várias vezes.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icons.users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    QSA visível e organizado
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    O quadro societário aparece de forma clara, sem precisar
                    procurar.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icons.fileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    PDF fácil de entender
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Quem recebe o documento bate o olho e entende.
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
                  Como funciona
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <div className="relative">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                      1
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Digite o CNPJ que você quer consultar.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                      2
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Buscamos os dados públicos disponíveis e organizamos tudo
                      em um PDF.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                      3
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Baixe, envie ou consulte de novo quando precisar, sem
                      gastar crédito outra vez.
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
                  Para quem isso faz diferença
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.briefcase className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Contadores</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Menos tempo procurando informação, mais tempo atendendo
                      cliente.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.building className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Escritórios e assessorias</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Documento mais claro para validações e processos internos.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.users className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">MEIs e pequenas empresas</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      CNPJ organizado para banco, fornecedor e cadastro.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.fileText className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Prestadores de serviço PJ</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Arquivo limpo para contratos e comprovações.
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
              <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Pensado para quem usa no celular
                </h2>
              </div>
              <div className="bg-linear-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Muita consulta de CNPJ acontece fora do computador: no
                      banco, no cartório, em atendimento ou reunião.
                    </p>
                    <p className="text-muted-foreground">
                      O site oficial até abre no celular, mas exige zoom,
                      rolagem e paciência.
                    </p>
                    <p className="font-medium">
                      Aqui o documento já sai legível no celular, sem ficar
                      ajustando tela ou aumentando letra.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="font-medium">
                        Histórico de consultas: tudo fica salvo no seu painel
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="font-medium">
                        Sem mensalidade: você compra créditos, usa quando quiser
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="font-medium">Créditos não expiram</p>
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
              <div className="text-center space-y-3 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Transparência antes de qualquer coisa
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  O Cartão CNPJ pode ser emitido gratuitamente no site da
                  Receita Federal. Se quiser entender melhor o que é esse
                  documento e como funciona, veja{" "}
                  <a
                    href="/cartao-cnpj"
                    className="underline underline-offset-4"
                  >
                    o que é o Cartão CNPJ
                  </a>
                  .
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-6">
                <p className="text-sm text-muted-foreground text-center">
                  Os dados do CNPJ são públicos e vêm da Receita Federal. O CNPJ
                  Aqui não substitui a Receita nem "emite" documento oficial. O
                  que muda é a forma como essas informações aparecem:
                  organizadas em um PDF mais fácil de ler, enviar e usar no dia
                  a dia profissional.
                </p>
              </div>
            </div>
          </div>
        </section>

        <PublicPricingSection />

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
                    O Cartão CNPJ é gratuito?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Sim. A consulta é gratuita no site da Receita Federal. Se
                    quiser entender melhor a diferença entre o documento oficial
                    e a versão organizada, veja{" "}
                    <a
                      href="/cartao-cnpj"
                      className="underline underline-offset-4"
                    >
                      este guia sobre Cartão CNPJ
                    </a>
                    .
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    O documento é oficial?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Os dados são oficiais e públicos. O PDF é organizado pelo
                    CNPJ Aqui para facilitar a leitura e o envio.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Os dados ficam atualizados?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Sim. Cada consulta busca as informações mais recentes
                    disponíveis.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Preciso pagar mensalidade?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Não. Só paga quando precisar consultar.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    As consultas ficam salvas?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Sim. Todas ficam no seu painel para acesso depois.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Como funciona o pagamento?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Via PIX, com liberação automática.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Os créditos expiram?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">Não.</p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Posso comprar mais de um pacote?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Sim. Os créditos se acumulam.
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
                Precisa consultar um CNPJ agora?
              </h2>
              <p className="text-lg text-muted-foreground">
                Comece com 3 consultas gratuitas e veja se isso facilita o seu
                dia a dia.
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
