"use client";

import { useEffect, useState } from "react";

interface ShareCapability {
  canShareFiles: boolean;
  isLoading: boolean;
}

/**
 * Hook para detectar se o dispositivo suporta Web Share API com arquivos.
 * Usado para mostrar botão de compartilhar (mobile) ou imprimir (desktop).
 */
export function useShareCapability(): ShareCapability {
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkShareCapability = () => {
      if (typeof navigator === "undefined") {
        setCanShareFiles(false);
        setIsLoading(false);
        return;
      }

      if (!navigator.share || !navigator.canShare) {
        setCanShareFiles(false);
        setIsLoading(false);
        return;
      }

      try {
        const testFile = new File([""], "test.pdf", {
          type: "application/pdf",
        });
        const canShare = navigator.canShare({ files: [testFile] });
        setCanShareFiles(canShare);
      } catch {
        setCanShareFiles(false);
      }

      setIsLoading(false);
    };

    checkShareCapability();
  }, []);

  return { canShareFiles, isLoading };
}
