import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const publicRoutes = [
  "/",
  "/cartao-cnpj",
  "/login",
  "/termos",
  "/auth/callback",
];
const publicRoutePrefixes = ["/validar/", "/blog"];
// Rotas que redirecionam para /painel se autenticado
const authRoutes = ["/", "/login"];

function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Buffer.from(array).toString("base64");
}

function setSecurityHeaders(
  response: NextResponse,
  nonce: string,
): NextResponse {
  const isDevelopment = process.env.NODE_ENV === "development";

  const cspDirectives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' ${isDevelopment ? "'unsafe-eval'" : ""} https://cloud.umami.is https://*.google.com https://*.gstatic.com`,
    `script-src-elem 'self' 'unsafe-inline' https://cloud.umami.is https://*.google.com https://*.gstatic.com`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https://cloud.umami.is https://api-gateway.umami.dev https://brasilapi.com.br https://www.receitaws.com.br https://*.google.com https://*.gstatic.com",
    "worker-src 'self' blob:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
  ];

  response.headers.set(
    "Content-Security-Policy",
    cspDirectives.join("; ").trim(),
  );

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  if (!isDevelopment) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  response.headers.set("X-DNS-Prefetch-Control", "on");

  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const staticFilePatterns = [
    /^\/robots\.txt$/,
    /^\/sitemap\.xml$/,
    /^\/favicon\.ico$/,
    /^\/public\//,
    /^\/_next\//,
  ];

  if (staticFilePatterns.some((pattern) => pattern.test(pathname))) {
    return NextResponse.next();
  }

  const nonce = generateNonce();

  const session = await auth();
  const isAuthenticated = !!session?.user;

  const isPublicRoute =
    publicRoutes.includes(pathname) ||
    publicRoutePrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute && isAuthenticated) {
    const response = NextResponse.redirect(new URL("/painel", request.url));
    return setSecurityHeaders(response, nonce);
  }

  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    return setSecurityHeaders(response, nonce);
  }

  const response = NextResponse.next();
  response.headers.set("x-nonce", nonce);
  return setSecurityHeaders(response, nonce);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
