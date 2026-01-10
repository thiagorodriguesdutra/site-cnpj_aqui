import type { Metadata } from "next";
import { Icons } from "@/components/icons";
import { PublicFooter } from "@/components/public/footer";
import { PublicHeader } from "@/components/public/header";
import { publicEnv } from "@/lib/env.public";

const appUrl = publicEnv.NEXT_PUBLIC_APP_URL || "https://www.cnpjfacil.com.br";

export const metadata: Metadata = {
  title: "Cartão CNPJ: o que é, como emitir e para que serve",
  description:
    "O que é o Cartão CNPJ, como emitir gratuitamente na Receita Federal e quando esse documento é exigido no dia a dia das empresas.",
  keywords: [
    "cartão cnpj",
    "o que é cartão cnpj",
    "como emitir cartão cnpj",
    "cartão cnpj receita federal",
    "cartão cnpj gratuito",
    "comprovante de inscrição cnpj",
  ],
  openGraph: {
    type: "article",
    locale: "pt_BR",
    url: `${appUrl}/cartao-cnpj`,
    title: "Cartão CNPJ: o que é, como emitir e para que serve",
    description:
      "O que é o Cartão CNPJ, como emitir gratuitamente na Receita Federal e quando esse documento é exigido no dia a dia das empresas.",
    siteName: "CNPJ Aqui",
  },
  alternates: {
    canonical: `${appUrl}/cartao-cnpj`,
  },
};

export default function CartaoCNPJPage() {
  return (
    <div className="min-h-screen">
      <PublicHeader />

      <main>
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <header className="mb-12 space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Cartão CNPJ: o que é, como emitir e para que serve
                </h1>
                <p className="text-lg text-muted-foreground">
                  Se você pesquisou por "Cartão CNPJ", provavelmente precisa de
                  um documento da empresa para banco, contrato, fornecedor ou
                  algum tipo de cadastro.
                </p>
                <p className="text-lg text-muted-foreground">
                  "Cartão CNPJ" é o nome que as pessoas usam no dia a dia para
                  um documento oficial da Receita Federal. O nome não é esse,
                  mas é assim que todo mundo chama.
                </p>
              </header>

              <div className="prose prose-lg max-w-none space-y-12">
                <section className="space-y-4">
                  <h2 className="text-3xl font-bold">O que é o Cartão CNPJ?</h2>
                  <p className="text-muted-foreground">
                    Cartão CNPJ é o nome popular do documento chamado:
                  </p>
                  <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg">
                    <p className="font-semibold text-lg">
                      Comprovante de Inscrição e de Situação Cadastral da Pessoa
                      Jurídica
                    </p>
                  </div>
                  <p className="text-muted-foreground">
                    É um documento que reúne as principais informações de uma
                    empresa registrada no Brasil, como CNPJ, razão social,
                    situação cadastral, endereço, atividade econômica e, quando
                    disponível, o quadro societário.
                  </p>
                  <p className="text-muted-foreground">
                    Na prática, quando alguém pede "o Cartão CNPJ da empresa",
                    está pedindo esse comprovante.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    Cartão CNPJ é gratuito?
                  </h2>
                  <p className="text-muted-foreground">
                    Sim.
                    <br />O Cartão CNPJ é gratuito.
                  </p>
                  <p className="text-muted-foreground">
                    Qualquer pessoa pode emitir esse documento diretamente no
                    site da Receita Federal, sem pagar nada por isso.
                  </p>
                  <p className="text-muted-foreground">
                    Não existe taxa, assinatura ou exigência de cadastro para
                    emitir o documento oficial.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    Onde emitir o Cartão CNPJ gratuitamente?
                  </h2>
                  <p className="text-muted-foreground">
                    A emissão é feita diretamente no{" "}
                    <a
                      href="https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                    >
                      site da Receita Federal
                    </a>
                    .
                  </p>
                  <p className="text-muted-foreground">
                    Funciona de forma simples:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-none pl-0">
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>você informa o número do CNPJ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>consulta os dados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>gera o comprovante em PDF</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    Esse é o documento oficial aceito por bancos, empresas e
                    órgãos públicos.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    Para que serve o Cartão CNPJ?
                  </h2>
                  <p className="text-muted-foreground">
                    O Cartão CNPJ serve para comprovar que uma empresa existe e
                    qual é a situação cadastral dela.
                  </p>
                  <p className="text-muted-foreground">
                    Ele costuma ser solicitado em situações comuns do dia a dia,
                    como:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-none pl-0">
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>abertura de conta bancária</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>envio de dados para fornecedores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>contratos de prestação de serviço</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>cadastros empresariais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>validações internas ou externas</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    Por isso, é um documento bastante usado por quem lida com
                    empresa regularmente.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    O Cartão CNPJ é obrigatório?
                  </h2>
                  <p className="text-muted-foreground">
                    Não existe uma lei que diga que o Cartão CNPJ é obrigatório
                    em todos os casos.
                  </p>
                  <p className="text-muted-foreground">
                    Mesmo assim, ele é amplamente exigido por bancos, empresas e
                    instituições como forma padrão de comprovação cadastral.
                  </p>
                  <p className="text-muted-foreground">
                    Na prática, quando pedem o Cartão CNPJ, esperam receber esse
                    comprovante da Receita.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    O Cartão CNPJ tem validade?
                  </h2>
                  <p className="text-muted-foreground">
                    O Cartão CNPJ não tem uma data de validade fixa.
                  </p>
                  <p className="text-muted-foreground">
                    Ele mostra a situação da empresa no momento em que foi
                    emitido. Se algum dado mudar, o documento fica
                    desatualizado.
                  </p>
                  <p className="text-muted-foreground">
                    Por isso, é comum bancos e empresas pedirem uma versão
                    recente do Cartão CNPJ.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    Qual é o problema do Cartão CNPJ no formato oficial?
                  </h2>
                  <p className="text-muted-foreground">
                    O documento oficial funciona e é válido. O problema é o uso
                    no dia a dia.
                  </p>
                  <p className="text-muted-foreground">No formato padrão:</p>
                  <ul className="space-y-2 text-muted-foreground list-none pl-0">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>a leitura não é clara</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>as informações ficam espalhadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>dados importantes não ficam em destaque</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        o quadro societário nem sempre é fácil de localizar
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>no celular, tudo fica mais difícil</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    Nada disso invalida o documento, mas torna o uso pouco
                    prático em situações reais.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    Por que todo mundo chama de "Cartão CNPJ"?
                  </h2>
                  <p className="text-muted-foreground">
                    Porque, na prática, as pessoas precisam de algo simples: um
                    documento com os dados principais da empresa, fácil de
                    mostrar, enviar ou anexar.
                  </p>
                  <p className="text-muted-foreground">
                    O nome oficial é longo e pouco intuitivo. O nome popular
                    pegou porque reflete melhor o uso real do documento.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    Uso do Cartão CNPJ no celular
                  </h2>
                  <p className="text-muted-foreground">
                    Muita consulta de CNPJ acontece pelo celular. No banco, no
                    cartório, em atendimento ou em reuniões rápidas.
                  </p>
                  <p className="text-muted-foreground">
                    O site oficial funciona, mas não foi pensado para esse
                    contexto. No celular, exige zoom, rolagem e paciência para
                    achar as informações.
                  </p>
                  <p className="text-muted-foreground">
                    Quando o Cartão CNPJ precisa ser usado com frequência,
                    especialmente fora do computador, um formato mais claro
                    ajuda bastante e evita retrabalho.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    Quando faz sentido usar uma versão organizada do Cartão
                    CNPJ?
                  </h2>
                  <p className="text-muted-foreground">
                    Se você precisa do documento apenas uma vez, o site da
                    Receita Federal resolve.
                  </p>
                  <p className="text-muted-foreground">Agora, se você:</p>
                  <ul className="space-y-2 text-muted-foreground list-none pl-0">
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>consulta CNPJ com frequência</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>precisa reenviar o documento várias vezes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>trabalha com validação de empresas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        usa o Cartão CNPJ em banco, contrato ou cadastro
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>precisa do quadro societário de forma clara</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>quer conferir dados rapidamente</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    Uma versão organizada acaba economizando tempo.
                  </p>
                </section>

                <section className="space-y-4 bg-muted/30 p-8 rounded-lg">
                  <h2 className="text-3xl font-bold">
                    Uma forma mais prática de usar os dados do Cartão CNPJ
                  </h2>
                  <p className="text-muted-foreground">
                    <a href="/login" className="underline underline-offset-4">
                      o CNPJ Aqui organiza essas informações em um PDF mais
                      fácil de usar
                    </a>
                  </p>
                  <p className="text-muted-foreground">O que ele faz é:</p>
                  <ul className="space-y-2 text-muted-foreground list-none pl-0">
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>consultar dados públicos do CNPJ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        organizar essas informações em um PDF mais fácil de ler
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>incluir o quadro societário quando disponível</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>gerar QR Code para conferência online</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>salvar o histórico de consultas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        permitir baixar o documento novamente sem refazer a
                        consulta
                      </span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    Tudo com transparência sobre a origem pública dos dados.
                  </p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-3xl font-bold">
                    Cartão CNPJ organizado para uso profissional
                  </h2>
                  <p className="text-muted-foreground">
                    Quem lida com CNPJ no dia a dia — como contadores, empresas,
                    prestadores de serviço ou escritórios — acaba usando esse
                    documento com frequência.
                  </p>
                  <p className="text-muted-foreground">
                    Ter o Cartão CNPJ organizado facilita:
                  </p>
                  <ul className="space-y-2 text-muted-foreground list-none pl-0">
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>apresentações</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>validações</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>cadastros</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>contratos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icons.checkCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>processos internos</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground">
                    E reduz o tempo gasto com tarefas repetitivas.
                  </p>
                </section>

                <section className="space-y-6">
                  <h2 className="text-3xl font-bold">
                    Perguntas comuns sobre Cartão CNPJ
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="font-semibold mb-2">
                        Cartão CNPJ e contrato social são a mesma coisa?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Não. O contrato social define a constituição da empresa.
                        O Cartão CNPJ mostra a situação cadastral.
                      </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="font-semibold mb-2">
                        Cartão CNPJ vale como comprovante?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Sim. É amplamente aceito como comprovante cadastral.
                      </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="font-semibold mb-2">
                        MEI também tem Cartão CNPJ?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Sim. MEI possui CNPJ e pode emitir o documento
                        normalmente.
                      </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                      <h3 className="font-semibold mb-2">
                        Posso consultar o CNPJ de qualquer empresa?
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Sim. As informações são públicas.
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <section className="mt-16 bg-linear-to-br from-primary/10 to-accent/10 rounded-xl p-8 md:p-12 text-center space-y-6">
                <h2 className="text-3xl font-bold">
                  Precisa usar o Cartão CNPJ com frequência?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Se você só precisa do documento oficial uma vez, a Receita
                  Federal resolve.
                </p>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Se você usa o Cartão CNPJ no dia a dia, o CNPJ Aqui ajuda a
                  organizar e reutilizar essas informações.
                </p>
                <a
                  href="/login"
                  className="h-12 px-8 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  Consultar CNPJ grátis
                </a>
              </section>
            </div>
          </div>
        </article>
      </main>

      <PublicFooter />
    </div>
  );
}
