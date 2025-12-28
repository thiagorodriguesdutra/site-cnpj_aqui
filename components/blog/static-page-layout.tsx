import Link from "next/link";
import type { ReactNode } from "react";
import { Icons } from "@/components/icons";

interface StaticPageLayoutProps {
  children: ReactNode;
  title: string;
  lastUpdated?: string;
}

export function StaticPageLayout({
  children,
  title,
  lastUpdated,
}: StaticPageLayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="text-xl" />
          </Link>
        </div>
      </header>

      <main className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8">{title}</h1>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              {children}
            </div>

            {lastUpdated && (
              <div className="border-t border-border pt-8 mt-12">
                <p className="text-sm text-muted-foreground">
                  <strong>Última atualização:</strong> {lastUpdated}
                </p>
              </div>
            )}

            <div className="mt-12 pt-8 border-t border-border">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                <Icons.chevronDown className="w-4 h-4 rotate-90" />
                Voltar para o início
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-muted/30 py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Icons.logo className="text-xl" />
            </div>
            <p className="text-sm text-muted-foreground">
              Gere cartões CNPJ de forma rápida e confiável
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
