"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="relative h-9 w-9 flex items-center justify-center rounded-full bg-muted/50 transition-colors"
        aria-label="Alternar tema"
      >
        <span className="h-4 w-4 rounded-full bg-muted-foreground/20 animate-pulse" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-9 w-9 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted transition-all duration-300"
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      <Sun
        className={`absolute h-4 w-4 text-foreground transition-all duration-300 ${
          isDark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        }`}
      />
      <Moon
        className={`absolute h-4 w-4 text-foreground transition-all duration-300 ${
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
