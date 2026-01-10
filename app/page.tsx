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
                  Cartão CNPJ pronto para usar
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  Gere um PDF claro, organizado e verificável, com dados
                  oficiais da Receita Federal — feito para resolver tudo pelo
                  celular.
                </p>
              </div>

              <HeroSearchInput />

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <Icons.checkCircle className="w-4 h-4 text-primary" />
                  <span>Mobile-first</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.checkCircle className="w-4 h-4 text-primary" />
                  <span>Sem captcha</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.checkCircle className="w-4 h-4 text-primary" />
                  <span>Compartilhamento imediato</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.checkCircle className="w-4 h-4 text-primary" />
                  <span>Verificação por QR Code</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-4 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  O mesmo dado oficial. Um uso muito mais simples.
                </h2>
                <div className="text-muted-foreground max-w-2xl mx-auto space-y-4">
                  <p>
                    O documento da Receita existe. O problema é usar ele no dia
                    a dia — especialmente no celular.
                  </p>
                  <p>
                    Aqui você recebe os dados organizados em um PDF feito para
                    leitura rápida, envio imediato e conferência de veracidade.
                  </p>
                </div>
              </div>

              <div className="mb-6 text-center">
                <p className="text-lg font-medium">
                  O problema nunca foi o dado. Foi o formato.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg text-muted-foreground">
                    Receita Federal
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Icons.close className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        Difícil no celular
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.close className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        Informação espalhada
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.close className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        Nenhum recurso de verificação
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.close className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        Pouco prático para envio
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card border-2 border-primary rounded-lg p-6 space-y-4">
                  <h3 className="font-semibold text-lg text-primary">
                    CNPJ Aqui
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Layout limpo e direto</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Mobile-first</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>QR Code para conferência</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Pronto para enviar</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icons.zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    Sem captcha. Sem erro. Sem insistir.
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Digite o CNPJ, gere o documento e siga com sua tarefa. Sem
                    travar, sem tentar de novo, sem perder tempo.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icons.users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    Quadro societário organizado (QSA)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    O quadro societário não aparece no documento atual da
                    Receita. Aqui ele vem separado, legível e fácil de entender
                    quando disponível.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icons.qrCode className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    Documento verificável
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Cada PDF inclui um QR Code que leva a uma página de
                    verificação. Quem recebe pode conferir data, hora e origem
                    da consulta.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icons.share className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">
                    Compartilhe em segundos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Envie o Cartão CNPJ direto pelo WhatsApp, e-mail ou link.
                    Sem baixar, renomear ou procurar arquivo depois.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="para-quem" className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center space-y-3 mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Para quem usa CNPJ no dia a dia
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.briefcase className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Contadores</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mais agilidade na validação e um documento fácil de
                      conferir.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.building className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Escritórios e assessorias</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Menos dúvida, menos devolução e mais confiança no envio.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.users className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">MEIs e pequenas empresas</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Documento profissional, pronto para banco e cadastro.
                    </p>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-5 text-center space-y-3">
                  <Icons.fileText className="w-8 h-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Prestadores de serviço PJ</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Envio rápido com QR Code que reforça credibilidade.
                    </p>
                  </div>
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
                  Três passos. Sem curva de aprendizado.
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
                      Buscamos os dados públicos mais recentes da Receita
                      Federal e organizamos tudo em um PDF claro.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold">
                      3
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Baixe, compartilhe ou envie o link de verificação com QR
                      Code, sem gastar crédito outra vez.
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
                  Pensado para quem resolve tudo pelo celular
                </h2>
              </div>
              <div className="bg-linear-to-br from-primary/5 to-accent/5 border border-border rounded-xl p-8 md:p-12">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Consulta de CNPJ acontece em banco, reunião, atendimento
                      ou cartório. O site oficial até funciona, mas exige zoom e
                      paciência.
                    </p>
                    <p className="font-medium">
                      Aqui o documento já nasce legível no celular. Você abre,
                      confere e envia — simples assim.
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
              <div className="text-center space-y-3 mb-8">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Transparência antes de qualquer coisa
                </h2>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  O Cartão CNPJ pode ser emitido gratuitamente no site da
                  Receita Federal. O CNPJ Aqui não substitui a Receita nem emite
                  documento oficial.
                </p>
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2">Cada PDF informa:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>data e hora da emissão</li>
                    <li>origem dos dados</li>
                    <li>situação cadastral naquele momento</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Além disso, o QR Code permite verificar a veracidade da
                  consulta online.
                </p>
                <p className="text-sm">
                  <a
                    href="/cartao-cnpj"
                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    Entenda o que é o Cartão CNPJ
                  </a>
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
                    Esse documento é oficial?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Não — e isso é importante. Os dados são oficiais e públicos.
                    O PDF organiza essas informações e inclui QR Code para
                    conferência.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    O QR Code serve para quê?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Ele leva a uma página de verificação com data, hora e origem
                    da consulta.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    O quadro societário aparece?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Quando disponível nos dados públicos, sim. Ele vem
                    organizado e separado no documento.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Preciso pagar mensalidade?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Não. Você compra créditos e usa quando quiser.
                  </p>
                </details>

                <details className="bg-card border border-border rounded-lg p-6 group">
                  <summary className="font-semibold cursor-pointer flex items-center justify-between">
                    Os créditos expiram?
                    <Icons.chevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground mt-4">
                    Não. Os créditos não expiram.
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
                Comece com 3 consultas gratuitas e gere um documento fácil de
                usar, enviar e verificar.
              </p>
              <div className="space-y-3">
                <a
                  href="/login"
                  className="h-12 px-8 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  Gerar Cartão CNPJ grátis
                </a>
                <p className="text-sm text-muted-foreground">
                  Sem cartão de crédito • Use quando quiser
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
