import Link from "next/link";
import { Icons } from "@/components/icons";

export function PublicHeader() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Icons.logo className="text-xl" />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="/#como-funciona"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Como funciona
          </a>
          <a
            href="/#planos"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Planos
          </a>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <a
            href="/#faq"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Dúvidas
          </a>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
          >
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  );
}
