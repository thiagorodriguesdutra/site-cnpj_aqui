"use client";

import { Icons } from "@/components/icons";

export function HeroSearchInput() {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const formatted = value
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
    e.target.value = formatted;
  };

  const handleClick = () => {
    window.location.href = "/login";
  };

  return (
    <div className="w-full">
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-accent/20 blur-3xl -z-10" />
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="cnpj-input"
              className="text-sm font-medium text-foreground block text-left"
            >
              Digite o CNPJ
            </label>
            <div className="relative">
              <input
                id="cnpj-input"
                type="text"
                placeholder="00.000.000/0000-00"
                className="w-full h-12 px-4 bg-background border border-input rounded-md text-foreground font-mono text-base focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                maxLength={18}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleClick}
            className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Icons.search className="w-5 h-5" />
            Gerar Cartão CNPJ grátis
          </button>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground text-center">
              3 consultas gratuitas • Sem cartão de crédito • Dados públicos da
              Receita Federal
            </p>
            <p className="text-xs text-muted-foreground text-center">
              Você decide quando usar seus créditos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
