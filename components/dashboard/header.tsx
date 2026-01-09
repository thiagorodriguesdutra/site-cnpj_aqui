import Link from "next/link";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { isUserAdmin } from "@/lib/auth";
import { createLogger } from "@/lib/logger";
import { UserNav } from "./user-nav";

const logger = createLogger("header");

export async function Header() {
  let _isAdmin = false;

  try {
    _isAdmin = await isUserAdmin();
  } catch (error) {
    const isDynamicServerError =
      error instanceof Error &&
      (error as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE";

    if (!isDynamicServerError) {
      logger.error(
        { error, operation: "isUserAdmin" },
        "Erro ao verificar se usuário é admin",
      );
    }
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/painel"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <Icons.logo className="text-xl" />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/painel"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icons.home className="w-4 h-4" />
              Painel
            </Link>
            <Link
              href="/uso"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icons.barChart className="w-4 h-4" />
              Uso
            </Link>
            <Link
              href="/conta"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icons.settings className="w-4 h-4" />
              Conta
            </Link>
            {/* {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 transition-colors font-medium"
              >
                <Icons.shield className="w-4 h-4" />
                Admin
              </Link>
            )} */}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
