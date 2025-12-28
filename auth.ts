import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./lib/db";
import {
  accounts,
  sessions,
  userCredits,
  users,
  verificationTokens,
} from "./lib/db/schema";
import { createLogger } from "./lib/logger";

const logger = createLogger("auth");

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: DrizzleAdapter(db, {
    // biome-ignore lint/suspicious/noExplicitAny: Adapter do Drizzle espera schemas específicos
    usersTable: users as any,
    // biome-ignore lint/suspicious/noExplicitAny: Adapter do Drizzle espera schemas específicos
    accountsTable: accounts as any,
    // biome-ignore lint/suspicious/noExplicitAny: Adapter do Drizzle espera schemas específicos
    sessionsTable: sessions as any,
    // biome-ignore lint/suspicious/noExplicitAny: Adapter do Drizzle espera schemas específicos
    verificationTokensTable: verificationTokens as any,
    // biome-ignore lint/suspicious/noExplicitAny: Adapter do Drizzle espera schemas específicos
  }) as any,
  session: {
    strategy: "jwt",
  },
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return false;
      }

      try {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
          with: {
            accounts: true,
          },
        });

        if (account?.provider === "google" && existingUser) {
          const hasGoogleAccount = existingUser.accounts?.some(
            (acc) => acc.provider === "google",
          );

          if (!hasGoogleAccount) {
            logger.info(
              { userId: existingUser.id, email: user.email },
              "Vinculando conta Google a usuário existente",
            );
          }
        }

        if (existingUser) {
          const existingCredits = await db.query.userCredits.findFirst({
            where: eq(userCredits.userId, existingUser.id),
          });

          if (!existingCredits) {
            await db.insert(userCredits).values({
              userId: existingUser.id,
              availableCredits: 3,
              totalUsed: 0,
            });

            logger.info(
              { userId: existingUser.id },
              "Créditos iniciais criados para usuário existente",
            );
          }
        }

        return true;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro desconhecido";
        const errorStack = error instanceof Error ? error.stack : undefined;
        logger.error(
          { error: errorMessage, stack: errorStack },
          "Erro no callback signIn ao verificar usuário existente",
        );

        return true;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }

      if (account) {
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
      }

      return session;
    },
  },
  events: {
    async createUser({ user }) {
      logger.info(
        { userId: user.id, email: user.email },
        "Novo usuário criado com sucesso",
      );

      try {
        if (user.id) {
          await db.insert(userCredits).values({
            userId: user.id,
            availableCredits: 3,
            totalUsed: 0,
          });

          logger.info(
            { userId: user.id },
            "Créditos iniciais criados para novo usuário",
          );
        }
      } catch (error) {
        logger.error(
          { error, userId: user.id },
          "Erro ao criar créditos iniciais para novo usuário",
        );
      }
    },
    async linkAccount({ user, account }) {
      logger.info(
        { userId: user.id, provider: account.provider },
        "Conta vinculada ao usuário",
      );
    },
  },
});
