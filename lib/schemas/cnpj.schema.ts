import { z } from "zod";

function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, "");

  if (cleaned.length !== 14) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;

  let sum = 0;
  let pos = 5;
  for (let i = 0; i < 12; i++) {
    sum += Number.parseInt(cleaned.charAt(i), 10) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number.parseInt(cleaned.charAt(12), 10)) return false;

  sum = 0;
  pos = 6;
  for (let i = 0; i < 13; i++) {
    sum += Number.parseInt(cleaned.charAt(i), 10) * pos;
    pos = pos === 2 ? 9 : pos - 1;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== Number.parseInt(cleaned.charAt(13), 10)) return false;

  return true;
}

export const cnpjSchema = z
  .string()
  .min(1, "CNPJ é obrigatório")
  .transform((val) => val.replace(/\D/g, ""))
  .refine((val) => val.length === 14, {
    message: "CNPJ deve ter 14 dígitos",
  })
  .refine((val) => validateCNPJ(val), {
    message: "CNPJ inválido",
  });

export const queryCNPJSchema = z.object({
  cnpj: cnpjSchema,
});

export type QueryCNPJInput = z.infer<typeof queryCNPJSchema>;
