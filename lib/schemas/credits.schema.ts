import { z } from "zod";

export const planTypeSchema = z.enum([
  "basico",
  "starter",
  "pro",
  "anual_pro",
  "pacote_20",
  "pacote_100",
]);

export const addCreditsSchema = z.object({
  userId: z.string().uuid("ID de usuário inválido"),
  amount: z.number().int().positive("Quantidade deve ser positiva"),
  planType: planTypeSchema,
});

export const consumeCreditsSchema = z.object({
  userId: z.string().uuid("ID de usuário inválido"),
  amount: z.number().int().positive("Quantidade deve ser positiva").default(1),
});

export type PlanType = z.infer<typeof planTypeSchema>;
export type AddCreditsInput = z.infer<typeof addCreditsSchema>;
export type ConsumeCreditsInput = z.infer<typeof consumeCreditsSchema>;
