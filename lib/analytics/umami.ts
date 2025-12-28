declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, unknown>) => void;
    };
  }
}

type FunnelEvents =
  | "landing_visualizada"
  | "consulta_cnpj_sucesso"
  | "consulta_cnpj_erro"
  | "pdf_gerado"
  | "clique_pacote"
  | "pedido_pagamento_criado"
  | "checkout_visualizado"
  | "pix_copiado"
  | "checkout_saiu"
  | "pagamento_confirmado"
  | "pagamento_erro"
  | "creditos_esgotados";

type AuthEvents = "login_visualizado" | "login_sucesso" | "logout";

type NavigationEvents =
  | "painel_visualizado"
  | "planos_visualizado"
  | "uso_visualizado"
  | "blog_visualizado";

type ComplementaryEvents =
  | "pacote_selecionado"
  | "tipo_usuario_definido"
  | "usuario_tem_credito";

type ValidationEvents =
  | "documento_validado"
  | "pagina_validacao_acessada"
  | "qr_code_escaneado";

type UmamiEvents =
  | FunnelEvents
  | AuthEvents
  | NavigationEvents
  | ComplementaryEvents
  | ValidationEvents;

export const trackEvent = (
  event: UmamiEvents,
  data?: Record<string, unknown>,
) => {
  if (typeof window === "undefined") return;

  if (window.umami) {
    window.umami.track(event, data);
  }
};

export const events = {
  landingViewed: () => trackEvent("landing_visualizada"),

  cnpjLookupSuccess: (cnpj: string) =>
    trackEvent("consulta_cnpj_sucesso", {
      queried_cnpj: cnpj.substring(0, 8),
    }),

  cnpjLookupError: (error: string) =>
    trackEvent("consulta_cnpj_erro", { error_type: error }),

  pdfGenerated: (cnpj: string) =>
    trackEvent("pdf_gerado", { cnpj_base: cnpj.substring(0, 8) }),

  packageClicked: (packageId: string, value: number) =>
    trackEvent("clique_pacote", { pacote_id: packageId, valor: value }),

  paymentOrderCreated: (packageId: string, value: number) =>
    trackEvent("pedido_pagamento_criado", {
      pacote_id: packageId,
      valor: value,
    }),

  checkoutViewed: (orderId: string, packageId: string, value: number) =>
    trackEvent("checkout_visualizado", {
      order_id: orderId,
      pacote_id: packageId,
      valor: value,
    }),

  pixCopied: (orderId: string, packageId: string) =>
    trackEvent("pix_copiado", { order_id: orderId, pacote_id: packageId }),

  checkoutExited: (orderId: string) =>
    trackEvent("checkout_saiu", { order_id: orderId }),

  paymentConfirmed: (packageId: string, credits: number) =>
    trackEvent("pagamento_confirmado", {
      pacote_id: packageId,
      creditos: credits,
    }),

  paymentError: (orderId: string, error: string) =>
    trackEvent("pagamento_erro", { order_id: orderId, tipo_erro: error }),

  creditsDepleted: (attemptedLookup: boolean = true) =>
    trackEvent("creditos_esgotados", { tentou_consultar: attemptedLookup }),

  loginViewed: () => trackEvent("login_visualizado"),

  loginSuccess: (provider: string = "google") =>
    trackEvent("login_sucesso", { provider }),

  logout: () => trackEvent("logout"),

  dashboardViewed: (credits: number) =>
    trackEvent("painel_visualizado", { creditos_disponiveis: credits }),

  plansViewed: (totalPlans: number) =>
    trackEvent("planos_visualizado", { total_planos: totalPlans }),

  usageViewed: (availableCredits: number, totalUsed: number) =>
    trackEvent("uso_visualizado", {
      creditos_disponiveis: availableCredits,
      total_usado: totalUsed,
    }),

  blogViewed: (slug: string) =>
    trackEvent("blog_visualizado", { artigo_slug: slug }),

  packageSelected: (packageId: string) =>
    trackEvent("pacote_selecionado", { pacote_id: packageId }),

  userTypeDefined: (type: string) =>
    trackEvent("tipo_usuario_definido", { tipo_usuario: type }),

  userHasCredits: (balance: number) =>
    trackEvent("usuario_tem_credito", { saldo: balance }),

  documentValidated: (documentId: string) =>
    trackEvent("documento_validado", { document_id: documentId }),

  validationPageAccessed: (documentId: string, source?: string) =>
    trackEvent("pagina_validacao_acessada", {
      document_id: documentId,
      source: source || "direct",
    }),

  qrCodeScanned: (documentId: string) =>
    trackEvent("qr_code_escaneado", { document_id: documentId }),
};
