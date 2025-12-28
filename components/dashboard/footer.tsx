export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} CNPJ Aqui. Todos os direitos
          reservados.
        </p>
        <nav className="flex items-center gap-4">
          <a href="/termos" className="hover:text-foreground transition-colors">
            Termos de Uso
          </a>
          <a
            href="/privacidade"
            className="hover:text-foreground transition-colors"
          >
            Privacidade
          </a>
        </nav>
      </div>
    </footer>
  );
}
