"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { createClientLogger } from "@/lib/logger/client";
import type { CnpjData } from "@/lib/services/cnpj.service";
import { maskCNPJ } from "@/lib/utils";

const logger = createClientLogger("resultado-consulta");

interface QueryResultProps {
  data: CnpjData;
  onNew?: () => void;
}

function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, "");
  return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12)}`;
}

function formatDate(date: string): string {
  if (!date) return "";
  const cleaned = date.replace(/\D/g, "");
  if (cleaned.length === 8) {
    return `${cleaned.slice(6, 8)}/${cleaned.slice(4, 6)}/${cleaned.slice(0, 4)}`;
  }
  return date;
}

export function QueryResult({ data, onNew }: QueryResultProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownloadPDF() {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/pdf/cartao-cnpj", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        logger.error(
          { status: response.status, cnpj: maskCNPJ(data.cnpj) },
          "Erro ao gerar PDF - resposta não ok",
        );
        throw new Error("Erro ao gerar PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cartao-cnpj-${data.cnpj}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      const { events } = await import("@/lib/analytics/umami");
      events.pdfGenerated(data.cnpj);

      logger.info({ cnpj: maskCNPJ(data.cnpj) }, "PDF gerado com sucesso");
    } catch (error) {
      logger.error(
        { error, cnpj: maskCNPJ(data.cnpj), operation: "downloadPDF" },
        "Erro ao baixar PDF",
      );
      alert("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.checkCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">
            Consulta realizada com sucesso
          </h3>
        </div>
        {onNew && (
          <Button variant="outline" size="sm" onClick={onNew}>
            Nova consulta
          </Button>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">CNPJ</p>
            <p className="text-sm font-mono">{formatCNPJ(data.cnpj)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              SITUAÇÃO CADASTRAL
            </p>
            <p className="text-sm">{data.situacaoCadastral}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">
            NOME EMPRESARIAL
          </p>
          <p className="text-sm font-medium">{data.razaoSocial}</p>
        </div>

        {data.nomeFantasia && (
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              NOME FANTASIA
            </p>
            <p className="text-sm">{data.nomeFantasia}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              DATA DE ABERTURA
            </p>
            <p className="text-sm">{formatDate(data.dataAbertura)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">PORTE</p>
            <p className="text-sm">{data.porte}</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">ENDEREÇO</p>
          <p className="text-sm">
            {data.logradouro}, {data.numero}
            {data.complemento && ` - ${data.complemento}`}
          </p>
          <p className="text-sm">
            {data.bairro} - {data.municipio}/{data.uf}
          </p>
          <p className="text-sm">CEP: {data.cep}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex-1 gap-2"
        >
          {isDownloading ? (
            <>
              <Icons.spinner className="w-4 h-4" />
              Gerando PDF...
            </>
          ) : (
            <>
              <Icons.download className="w-4 h-4" />
              Baixar Cartão CNPJ (PDF)
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
