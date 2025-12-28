import { eq } from "drizzle-orm";
import { cache } from "react";
import { auth } from "@/auth";
import { db } from "../db";
import { accounts, users } from "../db/schema";

export const getCurrentUser = cache(async () => {
  const session = await auth();
  return session?.user;
});

export const requireAuth = cache(async () => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Não autenticado");
  }

  return user;
});

export async function getUserProviders(userId: string): Promise<string[]> {
  const userAccounts = await db.query.accounts.findMany({
    where: eq(accounts.userId, userId),
  });

  return userAccounts.map((account) => account.provider);
}

export const isUserAdmin = cache(async (): Promise<boolean> => {
  const sessionUser = await getCurrentUser();

  if (!sessionUser?.id) {
    return false;
  }

  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, sessionUser.id))
    .limit(1);

  return user?.role === "admin";
});
