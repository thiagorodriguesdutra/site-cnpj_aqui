import QRCode from "qrcode";

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================
const DEFAULT_VALIDATION_BASE_URL = "https://www.cnpjaqui.com.br";

interface QRCodeOptions {
  width?: number;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
  errorCorrectionLevel?: "L" | "M" | "Q" | "H";
}

// ============================================================================
// GERADOR DE QR CODE
// ============================================================================

/**
 * Gera um Data URL do QR Code para validação do documento CNPJ
 *
 * @param documentId - ID único do documento para validação
 * @param baseUrl - URL base do sistema de validação (opcional)
 * @param options - Opções de customização do QR Code (opcional)
 * @returns Promise<string> - Data URL do QR Code em formato PNG
 *
 * @example
 * ```typescript
 * const qrCode = await generateQRCodeDataUrl("abc123");
 * // ou com URL customizada
 * const qrCode = await generateQRCodeDataUrl("abc123", "https://meusite.com.br");
 * ```
 */
export async function generateQRCodeDataUrl(
  documentId: string,
  baseUrl: string = DEFAULT_VALIDATION_BASE_URL,
  options: QRCodeOptions = {},
): Promise<string> {
  // Validação do documentId
  if (!documentId || typeof documentId !== "string") {
    throw new Error("documentId é obrigatório e deve ser uma string válida");
  }

  // Remove trailing slash da URL base se existir
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");

  // Monta a URL de validação completa
  const validationUrl = `${cleanBaseUrl}/validar/${documentId}`;

  // Configurações padrão otimizadas
  const defaultOptions: QRCodeOptions = {
    width: 300, // Aumentado para melhor resolução ao imprimir
    margin: 2, // Margem adequada para leitura
    darkColor: "#000000",
    lightColor: "#ffffff",
    errorCorrectionLevel: "M", // Correção de erro média (15%)
  };

  // Merge das opções
  const finalOptions = { ...defaultOptions, ...options };

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(validationUrl, {
      width: finalOptions.width,
      margin: finalOptions.margin,
      color: {
        dark: finalOptions.darkColor,
        light: finalOptions.lightColor,
      },
      errorCorrectionLevel: finalOptions.errorCorrectionLevel,
    });

    return qrCodeDataUrl;
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    throw new Error(
      `Falha ao gerar QR Code: ${error instanceof Error ? error.message : "erro desconhecido"}`,
    );
  }
}

/**
 * Gera a URL de validação sem o QR Code
 * Útil para exibir a URL em texto ou para outros fins
 *
 * @param documentId - ID único do documento
 * @param baseUrl - URL base do sistema de validação
 * @returns string - URL completa de validação
 */
export function getValidationUrl(
  documentId: string,
  baseUrl: string = DEFAULT_VALIDATION_BASE_URL,
): string {
  if (!documentId || typeof documentId !== "string") {
    throw new Error("documentId é obrigatório e deve ser uma string válida");
  }

  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  return `${cleanBaseUrl}/validar/${documentId}`;
}

/**
 * Retorna apenas o domínio base para exibição no documento
 * (sem o protocolo https://)
 *
 * @param baseUrl - URL base completa
 * @returns string - Domínio formatado para exibição
 */
export function getDisplayDomain(
  baseUrl: string = DEFAULT_VALIDATION_BASE_URL,
): string {
  return baseUrl
    .replace(/^https?:\/\//, "") // Remove protocolo
    .replace(/\/+$/, ""); // Remove trailing slash
}

// ============================================================================
// EXPORTAÇÃO DA CONSTANTE DE CONFIGURAÇÃO
// ============================================================================
export { DEFAULT_VALIDATION_BASE_URL };
