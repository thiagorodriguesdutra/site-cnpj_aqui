"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ArticleContent } from "@/components/blog/article-content";

export default function BlogTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isBlogIndex = pathname === "/blog";
  if (isBlogIndex) {
    return <>{children}</>;
  }
  return <ArticleContent>{children}</ArticleContent>;
}
