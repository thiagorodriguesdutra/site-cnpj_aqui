import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog | CNPJ Aqui",
  description:
    "Artigos sobre autenticidade de documentos, compliance e validação de CNPJ.",
};

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Blog CNPJ Aqui
        </h1>
        <p className="text-lg text-muted-foreground">
          Conteúdo sobre autenticidade, compliance e validação de documentos
          empresariais
        </p>
      </header>

      <div className="space-y-8">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <Link href={`/blog/${article.slug}`} className="group">
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {article.title}
              </h2>
              <p className="text-muted-foreground mb-4">
                {article.description}
              </p>
              <time
                dateTime={article.publishedAt}
                className="text-sm text-muted-foreground"
              >
                {new Date(article.publishedAt).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
