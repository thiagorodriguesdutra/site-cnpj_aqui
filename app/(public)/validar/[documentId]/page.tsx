import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icons } from "@/components/icons";
import { db, documentValidations, issuedDocuments } from "@/lib/db";
import { ValidationTracker } from "./validation-tracker";

interface ValidatePageProps {
  params: Promise<{
    documentId: string;
  }>;
  searchParams: Promise<{
    source?: string;
  }>;
}

export default async function ValidatePage({
  params,
  searchParams,
}: ValidatePageProps) {
  const { documentId } = await params;
  const { source } = await searchParams;

  const [document] = await db
    .select()
    .from(issuedDocuments)
    .where(eq(issuedDocuments.id, documentId))
    .limit(1);

  if (!document) {
    notFound();
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  const userAgent = headersList.get("user-agent") || "unknown";

  await db.insert(documentValidations).values({
    documentId: document.id,
    ipAddress: ip,
    userAgent,
  });

  const cnpjData = document.documentData as {
    cnpj: string;
    razaoSocial: string;
    situacaoCadastral: string;
  };

  const cnpjFormatado = cnpjData.cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );

  const dataEmissao = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(document.issuedAt);

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20">
      <ValidationTracker documentId={documentId} source={source} />

      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Icons.checkCircle className="w-12 h-12 text-primary" />
          </div>

          <h1 className="text-4xl font-bold mb-3">
            Documento Autêntico e Verificado.
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Este Cartão CNPJ foi gerado legitimamente pela plataforma CNPJ Aqui
            em{" "}
            <span className="font-semibold text-foreground">{dataEmissao}</span>{" "}
            e reflete fielmente os dados da Receita Federal naquele momento.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 mb-8 shadow-sm">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                CNPJ
              </h3>
              <p className="text-2xl font-mono font-bold">{cnpjFormatado}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Razão Social
              </h3>
              <p className="text-lg font-semibold">{cnpjData.razaoSocial}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Data e Hora de Emissão
              </h3>
              <p className="text-base">{dataEmissao}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Status na Data da Emissão
              </h3>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
                <span className="text-sm font-semibold text-primary">
                  {cnpjData.situacaoCadastral}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <Link
            href={`/api/pdf/cartao-cnpj?documentId=${documentId}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            <Icons.download className="w-5 h-5" />
            Baixar documento original (PDF)
          </Link>
        </div>

        <div className="bg-muted/50 border border-border rounded-lg p-8 text-center">
          <p className="text-lg mb-4 text-muted-foreground">
            Precisa consultar um CNPJ?
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-lg font-semibold hover:bg-foreground/90 transition-colors"
          >
            Faça sua busca grátis
            <Icons.chevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>
            Documento validado por{" "}
            <Link href="/" className="font-semibold hover:underline">
              CNPJ Aqui
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
