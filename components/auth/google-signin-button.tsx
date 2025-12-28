"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { createClientLogger } from "@/lib/logger/client";

const logger = createClientLogger("google-signin");

function GoogleSignInButtonContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/painel";

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      logger.error(
        { error, callbackUrl, operation: "googleSignIn" },
        "Erro ao fazer login com Google",
      );
      setIsLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      type="button"
      className="w-full"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Icons.google className="mr-2 h-4 w-4" />
      )}
      Continuar com Google
    </Button>
  );
}

export function GoogleSignInButton() {
  return (
    <Suspense
      fallback={
        <Button variant="outline" type="button" className="w-full" disabled>
          <Icons.google className="mr-2 h-4 w-4" />
          Continuar com Google
        </Button>
      }
    >
      <GoogleSignInButtonContent />
    </Suspense>
  );
}
