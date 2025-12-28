import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mascara CNPJ para exibição em logs
export function maskCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, "");
  if (cleaned.length < 14) return "***";
  return `${cleaned.substring(0, 4)}...${cleaned.substring(10, 14)}`;
}

// Mascara email para exibição em logs
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "***";
  const [local, domain] = email.split("@");
  const maskedLocal = local.length > 2 ? `${local.substring(0, 2)}***` : "***";
  return `${maskedLocal}@${domain}`;
}

// Mascara user ID para exibição em logs
export function maskUserId(userId: string): string {
  if (!userId || userId.length < 8) return userId;
  return `${userId.substring(0, 3)}...${userId.substring(userId.length - 3)}`;
}

// Formata CNPJ para exibição
export function formatCNPJ(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  const limited = cleaned.slice(0, 14);

  if (limited.length <= 2) return limited;
  if (limited.length <= 5) return `${limited.slice(0, 2)}.${limited.slice(2)}`;
  if (limited.length <= 8)
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`;
  if (limited.length <= 12)
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8)}`;
  return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8, 12)}-${limited.slice(12)}`;
}
