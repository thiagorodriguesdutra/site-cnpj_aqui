import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "../db";
import { users } from "../db/schema";
import { getCurrentUser } from "./index";

export async function requireAdmin() {
  const sessionUser = await getCurrentUser();

  if (!sessionUser?.id) {
    redirect("/login");
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionUser.id))
    .limit(1);

  if (!user || user.role !== "admin") {
    redirect("/painel");
  }

  return user;
}
