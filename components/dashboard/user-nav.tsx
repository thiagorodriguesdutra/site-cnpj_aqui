import { getCurrentUser } from "@/lib/auth";
import { createLogger } from "@/lib/logger";
import { LogoutButton } from "./logout-button";

const logger = createLogger("user-nav");

export async function UserNav() {
  let user: Awaited<ReturnType<typeof getCurrentUser>>;

  try {
    user = await getCurrentUser();
  } catch (error) {
    const isDynamicServerError =
      error instanceof Error &&
      (error as { digest?: string }).digest === "DYNAMIC_SERVER_USAGE";

    if (!isDynamicServerError) {
      logger.error(
        { error, operation: "getCurrentUser" },
        "Erro ao buscar usuário no UserNav",
      );
    }
    return null;
  }

  if (!user) {
    return null;
  }

  const displayName = user.name || user.email?.split("@")[0] || "Usuário";
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0].toUpperCase() || "U";

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">
              {initials}
            </span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {displayName}
          </span>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}
