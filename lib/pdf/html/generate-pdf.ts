import chromiumBinary from "@sparticuz/chromium";
import { type Browser, chromium } from "playwright-core";
import { createLogger } from "@/lib/logger";

const logger = createLogger("pdf-generator");

const isDevelopment = process.env.NODE_ENV === "development";

// Em desenvolvimento, reutilizamos o browser para melhor performance
let devBrowserInstance: Browser | null = null;

async function launchBrowser(): Promise<Browser> {
  if (isDevelopment) {
    // Em desenvolvimento, reutiliza o browser
    if (!devBrowserInstance || !devBrowserInstance.isConnected()) {
      devBrowserInstance = await chromium.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
    }
    return devBrowserInstance;
  }

  // Em produção (serverless), cada requisição cria seu próprio browser
  // Isso evita erros de "browser has been closed" entre invocações
  const executablePath = await chromiumBinary.executablePath();

  return await chromium.launch({
    executablePath,
    headless: true,
    args: chromiumBinary.args,
  });
}

interface GeneratePDFOptions {
  url: string;
  waitForSelector?: string;
  timeout?: number;
}

export async function generatePDFFromURL(
  options: GeneratePDFOptions,
): Promise<Buffer> {
  const { url, waitForSelector = ".pdf-page", timeout = 30000 } = options;

  const browser = await launchBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout,
    });

    await page.waitForSelector(waitForSelector, { timeout });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    return Buffer.from(pdfBuffer);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error({ errorMessage, url }, "Falha ao gerar PDF via URL");
    throw new Error(`Falha ao gerar PDF: ${errorMessage}`);
  } finally {
    await context.close();
    // Em produção, fecha o browser após cada uso
    if (!isDevelopment) {
      await browser.close();
    }
  }
}

export async function generatePDFFromHTML(html: string): Promise<Buffer> {
  const browser = await launchBrowser();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.setContent(html, {
      waitUntil: "load",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    return Buffer.from(pdfBuffer);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error({ errorMessage }, "Falha ao gerar PDF a partir do HTML");
    throw new Error(`Falha ao gerar PDF: ${errorMessage}`);
  } finally {
    await context.close();
    // Em produção, fecha o browser após cada uso
    if (!isDevelopment) {
      await browser.close();
    }
  }
}

// Cleanup para desenvolvimento
if (isDevelopment) {
  process.on("beforeExit", async () => {
    if (devBrowserInstance?.isConnected()) {
      await devBrowserInstance.close();
    }
  });

  process.on("SIGINT", async () => {
    if (devBrowserInstance?.isConnected()) {
      await devBrowserInstance.close();
    }
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    if (devBrowserInstance?.isConnected()) {
      await devBrowserInstance.close();
    }
    process.exit(0);
  });
}
