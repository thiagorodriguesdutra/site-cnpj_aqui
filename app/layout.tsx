import type { Metadata, Viewport } from "next";
import { Manrope, Source_Code_Pro } from "next/font/google";
import { UmamiScript } from "@/components/analytics/umami-script";
import { ThemeProvider } from "@/components/theme-provider";
import { publicEnv } from "@/lib/env.public";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: true,
  fallback: ["Menlo", "Monaco", "monospace"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(
    publicEnv.NEXT_PUBLIC_APP_URL || "https://www.cnpjaqui.com.br",
  ),
  title: {
    default: "CNPJ Aqui - Cartão CNPJ organizado para uso profissional",
    template: "%s | CNPJ Aqui",
  },
  description:
    "Organize dados públicos do CNPJ em PDF para uso profissional. Consulta rápida, sem captcha e com histórico.",
  applicationName: "CNPJ Aqui",
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${sourceCodePro.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <UmamiScript />
      </body>
    </html>
  );
}
