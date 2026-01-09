import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";
import { Icons } from "@/components/icons";
import { LoginTracker } from "./login-tracker";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Entrar",
  description:
    "Acesse sua conta no CNPJ Aqui para gerar cartões CNPJ de forma rápida e prática.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-4 py-12 bg-background">
      <LoginTracker />
      <div className="w-full max-w-md mx-auto space-y-6">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <Icons.logo className="text-4xl md:text-5xl" />
          </Link>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Entrar na sua conta
          </h1>
          <p className="text-muted-foreground">
            Use sua conta Google para acessar
          </p>
        </div>

        <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
