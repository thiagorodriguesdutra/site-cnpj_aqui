"use server";

import { auth, signOut } from "@/auth";
import { createLogger } from "@/lib/logger";

const logger = createLogger("auth-logout");

export async function logoutAction() {
  const session = await auth();
  const userId = session?.user?.id;

  try {
    await signOut({ redirect: false });

    logger.info({ userId }, "Logout realizado com sucesso");

    return {
      success: true,
    };
  } catch (error) {
    logger.error(
      { error, userId, operation: "signOut" },
      "Erro ao realizar logout",
    );
    throw new Error("Erro ao fazer logout");
  }
}
