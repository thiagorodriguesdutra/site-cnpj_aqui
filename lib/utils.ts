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

export function formatCNPJComplete(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, "");
  if (cleaned.length !== 14) return cnpj;
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
}

export function formatDateBR(date: string): string {
  if (!date) return "";
  const cleaned = date.replace(/\D/g, "");
  if (cleaned.length === 8) {
    return `${cleaned.slice(6, 8)}/${cleaned.slice(4, 6)}/${cleaned.slice(0, 4)}`;
  }
  const parsed = new Date(date);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("pt-BR");
  }
  return date;
}

export function formatCEP(cep: string): string {
  if (!cep) return "";
  const cleaned = cep.replace(/\D/g, "");
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}-${cleaned.slice(5)}`;
  }
  return cep;
}

export function formatPhoneBR(phone: string | undefined): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  return phone;
}

export function isMatriz(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, "");
  return cleaned.slice(8, 12) === "0001";
}

export function isSituacaoAtiva(situacao: string): boolean {
  return situacao?.toUpperCase().includes("ATIVA");
}
