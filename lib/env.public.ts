import { z } from "zod";

const url = z.string().url({ message: "URL inválida" });

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: url,
  NEXT_PUBLIC_UMAMI_URL: url.optional(),
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional(),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_UMAMI_URL: process.env.NEXT_PUBLIC_UMAMI_URL,
  NEXT_PUBLIC_UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
});

if (!parsed.success) {
  console.error("Erro ao validar variáveis de ambiente (client)");
  console.table(
    parsed.error.issues.map((issue) => ({
      variavel: issue.path.join("."),
      motivo: issue.message,
    })),
  );

  throw new Error("Variáveis de ambiente inválidas (client)");
}

export const publicEnv = parsed.data;
