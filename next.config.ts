import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "@sparticuz/chromium",
    "playwright-core",
  ],
  // Força inclusão dos binários do Chromium nas funções serverless
  outputFileTracingIncludes: {
    "/api/pdf/cartao-cnpj": ["./node_modules/@sparticuz/chromium/**/*"],
  },
  turbopack: {},
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
