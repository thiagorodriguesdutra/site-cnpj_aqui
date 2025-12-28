"use client";

import { signOut } from "next-auth/react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { events } from "@/lib/analytics/umami";

export function LogoutButton() {
  async function handleLogout() {
    events.logout();
    await signOut({ callbackUrl: "/" });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      title="Sair da conta"
      onClick={handleLogout}
    >
      <Icons.logout className="w-4 h-4" />
      <span className="hidden md:inline">Sair</span>
    </Button>
  );
}
