import type { ArticleMetadata } from "@/components/blog/mdx-layout";

export const articles: ArticleMetadata[] = [
  {
    title: "Como provar que um CNPJ está ativo para o banco?",
    description:
      "Entenda como comprovar a situação cadastral de uma empresa junto aos bancos usando documentos oficiais e verificáveis.",
    publishedAt: "2025-01-15",
    slug: "como-provar-cnpj-ativo-banco",
  },
  {
    title: "Cartão CNPJ com QR Code: A nova exigência dos cartórios",
    description:
      "Descubra por que os cartórios estão exigindo documentos com QR Code de verificação e como isso aumenta a segurança.",
    publishedAt: "2025-01-16",
    slug: "cartao-cnpj-qr-code-cartorios",
  },
  {
    title: "Validador de CNPJ: Como evitar fraudes",
    description:
      "Aprenda a identificar documentos fraudulentos e proteger seu negócio com validação de autenticidade digital.",
    publishedAt: "2025-01-17",
    slug: "validador-cnpj-evitar-fraudes",
  },
];

export function getArticleBySlug(slug: string): ArticleMetadata | undefined {
  return articles.find((article) => article.slug === slug);
}
