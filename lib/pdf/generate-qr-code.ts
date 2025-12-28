import QRCode from "qrcode";

export async function generateQRCodeDataUrl(
  documentId: string,
): Promise<string> {
  const validationUrl = `https://www.cnpjfacil.com.br/validar/${documentId}`;

  const qrCodeDataUrl = await QRCode.toDataURL(validationUrl, {
    width: 240,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  return qrCodeDataUrl;
}
