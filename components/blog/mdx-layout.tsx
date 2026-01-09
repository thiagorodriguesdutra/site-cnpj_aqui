import type { ReactNode } from "react";

export interface ArticleMetadata {
  title: string;
  description: string;
  publishedAt: string;
  slug: string;
}

interface MdxLayoutProps {
  children: ReactNode;
  metadata: ArticleMetadata;
}

export function MdxLayout({ children, metadata }: MdxLayoutProps) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <header className="mb-12 border-b border-border pb-8">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          {metadata.title}
        </h1>
        <p className="mb-4 text-lg text-muted-foreground">
          {metadata.description}
        </p>
        <time
          dateTime={metadata.publishedAt}
          className="text-sm text-muted-foreground"
        >
          Publicado em{" "}
          {new Date(metadata.publishedAt).toLocaleDateString("pt-BR", {
            day: "numeric",
            month: "long",
            year: "numeric",
            timeZone: "America/Sao_Paulo",
          })}
        </time>
      </header>

      <div className="prose prose-gray dark:prose-invert max-w-none">
        {children}
      </div>
    </article>
  );
}
