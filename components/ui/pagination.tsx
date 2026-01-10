"use client";

import { useCallback, useMemo } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  /** Página atual (1-indexed) */
  currentPage: number;
  /** Total de itens */
  totalItems: number;
  /** Itens por página */
  pageSize: number;
  /** Callback para mudança de página */
  onPageChange: (page: number) => void;
  /** Callback para mudança de tamanho da página */
  onPageSizeChange?: (size: number) => void;
  /** Opções de tamanho de página */
  pageSizeOptions?: number[];
  /** Label do item (ex: "transações", "documentos") */
  itemLabel?: string;
  /** Classes customizadas */
  className?: string;
  /** Desabilitar paginação */
  disabled?: boolean;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function generatePageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | "ellipsis")[] = [];

  pages.push(1);

  if (currentPage <= 3) {
    pages.push(2, 3, 4, "ellipsis");
  } else if (currentPage >= totalPages - 2) {
    pages.push("ellipsis", totalPages - 3, totalPages - 2, totalPages - 1);
  } else {
    pages.push(
      "ellipsis",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "ellipsis",
    );
  }

  pages.push(totalPages);

  return pages;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  itemLabel = "itens",
  className,
  disabled = false,
}: PaginationProps) {
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize],
  );

  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const startItem = useMemo(
    () => Math.min((currentPage - 1) * pageSize + 1, totalItems),
    [currentPage, pageSize, totalItems],
  );

  const endItem = useMemo(
    () => Math.min(currentPage * pageSize, totalItems),
    [currentPage, pageSize, totalItems],
  );

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePrevious = useCallback(() => {
    if (canGoPrevious && !disabled) {
      onPageChange(currentPage - 1);
    }
  }, [canGoPrevious, disabled, onPageChange, currentPage]);

  const handleNext = useCallback(() => {
    if (canGoNext && !disabled) {
      onPageChange(currentPage + 1);
    }
  }, [canGoNext, disabled, onPageChange, currentPage]);

  const handlePageClick = useCallback(
    (page: number) => {
      if (!disabled && page !== currentPage) {
        onPageChange(page);
      }
    },
    [disabled, currentPage, onPageChange],
  );

  const handlePageSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!disabled && onPageSizeChange) {
        const newSize = Number(e.target.value);
        onPageSizeChange(newSize);
      }
    },
    [disabled, onPageSizeChange],
  );

  if (totalItems === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {/* Navegação */}
      <nav
        className="flex items-center justify-center gap-1"
        aria-label="Paginacao"
      >
        {/* Botão Anterior */}
        <button
          type="button"
          onClick={handlePrevious}
          disabled={!canGoPrevious || disabled}
          className={cn(
            "inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            canGoPrevious && !disabled
              ? "text-foreground hover:bg-accent hover:text-accent-foreground"
              : "text-muted-foreground cursor-not-allowed opacity-50",
          )}
          aria-label="Pagina anterior"
        >
          <Icons.chevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        {/* Números de página - Desktop */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (page === "ellipsis") {
              const prevPage = pageNumbers[idx - 1];
              const ellipsisKey = `ellipsis-after-${prevPage}`;
              return (
                <span
                  key={ellipsisKey}
                  className="px-2 py-2 text-sm text-muted-foreground select-none"
                  aria-hidden="true"
                >
                  ...
                </span>
              );
            }
            return (
              <button
                key={page}
                type="button"
                onClick={() => handlePageClick(page)}
                disabled={disabled}
                className={cn(
                  "min-w-9 h-9 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  page === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  disabled && "cursor-not-allowed opacity-50",
                )}
                aria-label={`Pagina ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Indicador de página - Mobile */}
        <span className="sm:hidden px-4 py-2 text-sm text-muted-foreground">
          {currentPage} / {totalPages}
        </span>

        {/* Botão Próximo */}
        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext || disabled}
          className={cn(
            "inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            canGoNext && !disabled
              ? "text-foreground hover:bg-accent hover:text-accent-foreground"
              : "text-muted-foreground cursor-not-allowed opacity-50",
          )}
          aria-label="Proxima pagina"
        >
          <span>Proximo</span>
          <Icons.chevronRight className="w-4 h-4" />
        </button>
      </nav>

      {/* Info e PageSize - Desktop */}
      <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          Mostrando {startItem}-{endItem} de{" "}
          {totalItems.toLocaleString("pt-BR")} {itemLabel}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="whitespace-nowrap">
              Mostrar:
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={handlePageSizeChange}
              disabled={disabled}
              className={cn(
                "h-9 px-3 py-1 text-sm rounded-md border border-input bg-background",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
