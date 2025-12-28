import { z } from "zod";

const isProduction = process.env.NODE_ENV === "production";

const url = z.string().url({ message: "URL inválida" });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),

  NEXTAUTH_URL: url,
  DATABASE_URL: z.string().min(1),

  AUTH_SECRET: z.string().min(1),
  AUTH_URL: z.string().min(1),
  AUTH_TRUST_HOST: z.string().optional(),

  AUTH_GOOGLE_ID: isProduction ? z.string().min(1) : z.string().optional(),

  AUTH_GOOGLE_SECRET: isProduction ? z.string().min(1) : z.string().optional(),

  UMAMI_API_KEY: isProduction ? z.string().min(1) : z.string().optional(),

  RATE_LIMIT_WINDOW: z.coerce.number().min(1),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Erro ao validar variáveis de ambiente (server)");
  console.table(
    parsed.error.issues.map((issue) => ({
      variavel: issue.path.join("."),
      motivo: issue.message,
    })),
  );

  throw new Error("Variáveis de ambiente inválidas (server)");
}

export const env = parsed.data;
