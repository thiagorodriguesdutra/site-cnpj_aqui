"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";

export function SuccessNotification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        router.replace("/uso");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router]);

  if (!show) return null;

  return (
    <div className="bg-success/10 border border-success/20 rounded-xl p-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start gap-3">
        <Icons.checkCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            Créditos adicionados com sucesso
          </h3>
          <p className="text-sm text-muted-foreground">
            Seus créditos foram liberados e já estão disponíveis para uso.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShow(false);
            router.replace("/uso");
          }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Icons.close className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
