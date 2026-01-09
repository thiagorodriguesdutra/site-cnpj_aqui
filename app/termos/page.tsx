import type { Metadata } from "next";
import TermosContent from "@/content/pages/termos.mdx";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Termos de Uso | CNPJ Aqui",
  description: "Termos de uso e condições do serviço CNPJ Aqui",
};

export default function TermosPage() {
  return <TermosContent />;
}
