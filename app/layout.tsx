import type { Metadata, Viewport } from "next";
import { Manrope, Source_Code_Pro } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { publicEnv } from "@/lib/env.public";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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
    default: "CNPJ Aqui - Gere o Cartão CNPJ em segundos",
    template: "%s | CNPJ Aqui",
  },
  description:
    "Gere o Cartão CNPJ oficial em PDF sem acessar o site da Receita Federal. Rápido, confiável e sem captcha.",
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
      </body>
    </html>
  );
}
