"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { queryCNPJAction } from "@/app/_actions/cnpj";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CnpjInput } from "@/components/ui/cnpj-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createClientLogger } from "@/lib/logger/client";
import { queryCNPJSchema } from "@/lib/schemas";
import type { CnpjData } from "@/lib/services/cnpj.service";

const logger = createClientLogger("query-form");

type QueryCNPJInput = z.infer<typeof queryCNPJSchema>;

interface QueryFormProps {
  onSuccess?: (data: CnpjData, creditsRemaining: number) => void;
}

type LoadingStage = "fetching" | "formatting" | null;

export function QueryForm({ onSuccess }: QueryFormProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<LoadingStage>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<QueryCNPJInput>({
    resolver: zodResolver(queryCNPJSchema),
    defaultValues: {
      cnpj: "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let showLoadingTimer: NodeJS.Timeout;
    let stageTimer: NodeJS.Timeout;

    if (isLoading) {
      showLoadingTimer = setTimeout(() => {
        setShowLoading(true);
        setLoadingStage("fetching");
      }, 300);

      stageTimer = setTimeout(() => {
        setLoadingStage("formatting");
      }, 1800);
    } else {
      setShowLoading(false);
      setLoadingStage(null);
    }

    return () => {
      clearTimeout(showLoadingTimer);
      clearTimeout(stageTimer);
    };
  }, [isLoading]);

  async function onSubmit(data: QueryCNPJInput) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await queryCNPJAction(data);

      if (!result.success) {
        const errorMessage = result.error || "Erro ao consultar CNPJ";
        setError(errorMessage);

        const { events } = await import("@/lib/analytics/umami");
        events.cnpjLookupError(errorMessage);
        return;
      }

      if (result.data && onSuccess) {
        const { events } = await import("@/lib/analytics/umami");
        events.cnpjLookupSuccess(data.cnpj);
        onSuccess(result.data, result.creditsRemaining || 0);
      }

      form.reset();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erro inesperado ao consultar CNPJ";

      logger.error(
        {
          error: err,
          cnpj: `${data.cnpj.replace(/\D/g, "").slice(0, 4)}...`,
          operation: "queryCNPJ",
        },
        "Erro ao consultar CNPJ",
      );

      setError(errorMessage);

      const { events } = await import("@/lib/analytics/umami");
      events.cnpjLookupError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const getLoadingMessage = () => {
    if (!showLoading) return "Consultando...";
    if (loadingStage === "fetching")
      return "Buscando dados na Receita Federal…";
    return "Formatando documento…";
  };

  if (!isMounted) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-12 bg-muted animate-pulse rounded" />
          <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        </div>
        <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="cnpj"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ</FormLabel>
              <FormControl>
                <CnpjInput {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="p-3 text-sm rounded-md font-medium text-destructive bg-destructive/10">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full gap-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Icons.spinner className="w-4 h-4" />
              {getLoadingMessage()}
            </>
          ) : (
            <>
              <Icons.search className="w-4 h-4" />
              Consultar CNPJ
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
