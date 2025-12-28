"use client";

export default function GlobalError({ error }: { error: Error }) {
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
