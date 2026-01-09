import { type Browser, chromium } from "playwright";
import { createLogger } from "@/lib/logger";

const logger = createLogger("pdf-generator");

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browserInstance || !browserInstance.isConnected()) {
    browserInstance = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });
  }
  return browserInstance;
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance?.isConnected()) {
    await browserInstance.close();
    browserInstance = null;
  }
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

  const browser = await getBrowser();
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
  }
}

export async function generatePDFFromHTML(html: string): Promise<Buffer> {
  const browser = await getBrowser();
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
  }
}

process.on("beforeExit", async () => {
  await closeBrowser();
});

process.on("SIGINT", async () => {
  await closeBrowser();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeBrowser();
  process.exit(0);
});
