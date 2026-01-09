"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BlogTracker } from "@/app/(public)/blog/blog-tracker";
import { Icons } from "@/components/icons";

/**
 * Wrapper client para artigos individuais do blog.
 * Adiciona navegação, analytics e CTA.
 */
export function ArticleContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const slug = pathname.replace("/blog/", "") || "unknown";

  return (
    <div className="min-h-screen p-4 md:p-8 bg-background">
      <BlogTracker slug={slug} />
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icons.arrowLeft className="w-4 h-4" />
          Voltar para o blog
        </Link>

        <div className="bg-card rounded-lg border border-border p-6 md:p-8">
          {children}
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                Pronto para gerar seu Cartão CNPJ?
              </h3>
              <p className="text-sm text-muted-foreground">
                Comece com 3 consultas gratuitas
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Começar agora
              <Icons.arrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
