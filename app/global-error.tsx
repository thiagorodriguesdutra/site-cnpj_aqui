"use client";

import { useEffect } from "react";
import { createClientLogger } from "@/lib/logger/client";

const logger = createClientLogger("error-global");

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    logger.error(
      {
        error: error.message,
        stack: error.stack,
      },
      "Erro capturado pelo Global Error Boundary",
    );
  }, [error]);
  return (
    <html lang="pt-BR">
      <head>
        <title>Algumas coisa deu errado!</title>
      </head>
      <body>
        <h1>Alguma coisa deu errado!</h1>
        <pre>{error.message}</pre>
      </body>
    </html>
  );
}
