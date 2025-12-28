import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env.public";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    publicEnv.NEXT_PUBLIC_APP_URL || "https://www.cnpjaqui.com.br";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/termos", "/blog", "/validar/*"],
        disallow: [
          "/painel",
          "/uso",
          "/conta",
          "/planos",
          "/checkout/*",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
