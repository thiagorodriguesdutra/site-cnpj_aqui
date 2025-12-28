import Link from "next/link";
import { Icons } from "@/components/icons";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Icons.logo />
            </div>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                href="/termos"
                className="hover:text-foreground transition-colors"
              >
                Termos de Uso
              </Link>
              <span>•</span>
              <Link
                href="/termos#privacidade"
                className="hover:text-foreground transition-colors"
              >
                Política de Privacidade
              </Link>
            </nav>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 CNPJ Aqui</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
