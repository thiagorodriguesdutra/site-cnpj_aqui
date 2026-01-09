import type { CnpjData } from "@/lib/services/cnpj.service";
import {
  formatCEP,
  formatCNPJComplete,
  formatDateBR,
  formatPhoneBR,
  isMatriz,
  isSituacaoAtiva,
} from "@/lib/utils";

interface RenderCartaoCNPJOptions {
  data: CnpjData;
  emitidoEm?: Date;
  documentId: string;
  qrCodeDataUrl: string;
  validationBaseUrl?: string;
}

const CSS_STYLES = `
@page {
  size: A4;
  margin: 0;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 8pt;
  background-color: #ffffff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.pdf-page {
  width: 210mm;
  min-height: 297mm;
  padding: 16px;
  background-color: #ffffff;
}

.main-border {
  border: 1.5pt solid #1a1a1a;
  padding: 10px;
  background-color: #ffffff;
}

.header-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 0.5pt solid #cccccc;
}

.brasao {
  width: 48px;
  height: 48px;
  margin-right: 12px;
}

.header-text {
  flex: 1;
  text-align: center;
}

.header-title {
  font-size: 12pt;
  font-weight: bold;
  margin-bottom: 4px;
  color: #1a1a1a;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.header-subtitle {
  font-size: 10pt;
  font-weight: bold;
  color: #1a1a1a;
  letter-spacing: 0.3px;
}

.spacer {
  width: 48px;
  margin-left: 12px;
}

.row {
  display: flex;
  flex-direction: row;
  margin-bottom: 4px;
}

.first-row {
  margin-bottom: 4px;
}

.box {
  border: 1pt solid #333333;
  padding: 6px;
  display: flex;
  flex-direction: column;
}

.cnpj-box {
  width: 24%;
  background-color: #f5f5f5;
}

.document-title-box {
  width: 52%;
  border-left: none;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}

.data-abertura-box {
  width: 24%;
  border-left: none;
  background-color: #f5f5f5;
}

.full-width {
  width: 100%;
  margin-bottom: 4px;
}

.no-left-border {
  border-left: none;
}

.col-14 { width: 14%; }
.col-15 { width: 15%; }
.col-18 { width: 18%; }
.col-25 { width: 25%; }
.col-30 { width: 30%; }
.col-36 { width: 36%; }
.col-38 { width: 38%; }
.col-50 { width: 50%; }
.col-75 { width: 75%; }
.col-85 { width: 85%; }

.label {
  font-size: 6pt;
  margin-bottom: 3px;
  color: #555555;
  font-weight: bold;
  letter-spacing: 0.2px;
  text-transform: uppercase;
}

.value {
  font-size: 9pt;
  font-weight: bold;
  color: #000000;
  line-height: 1.3;
}

.value-small {
  font-size: 8pt;
  font-weight: bold;
  color: #000000;
  line-height: 1.3;
}

.document-title {
  font-size: 9pt;
  font-weight: bold;
  text-align: center;
  color: #1a1a1a;
  letter-spacing: 0.3px;
  line-height: 1.4;
  text-transform: uppercase;
}

.activity-item {
  font-size: 8pt;
  font-weight: bold;
  margin-bottom: 2px;
  color: #000000;
  line-height: 1.3;
  display: block;
}

.situacao-ativa {
  color: #006400;
}

.situacao-inativa {
  color: #8B0000;
}

.footer-container {
  margin-top: 6px;
  border-top: 0.5pt solid #cccccc;
  padding-top: 6px;
}

.footer-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.emission-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.footer-text {
  font-size: 6pt;
  color: #333333;
  margin-bottom: 1px;
}

.qr-column {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.qr-code {
  width: 40px;
  height: 40px;
  margin-right: 6px;
}

.auth-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.auth-text {
  font-size: 5.5pt;
  color: #444444;
  line-height: 1.2;
}

.auth-link {
  font-size: 5.5pt;
  color: #0056b3;
  font-weight: bold;
  margin-top: 1px;
}

@media print {
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .pdf-page {
    page-break-after: always;
  }
}
`;

const BRASAO_SVG = `<svg viewBox="0 0 100 100" class="brasao" role="img" aria-label="Brasao da Republica Federativa do Brasil">
  <title>Brasao da Republica Federativa do Brasil</title>
  <circle cx="50" cy="50" r="48" fill="#009c3b" />
  <path d="M50 8 L92 50 L50 92 L8 50 Z" fill="#ffdf00" />
  <circle cx="50" cy="50" r="28" fill="#002776" />
  <path d="M22 50 Q35 42, 50 44 Q65 46, 78 50 Q65 54, 50 52 Q35 50, 22 50" fill="#ffffff" stroke="#ffffff" stroke-width="3" />
  <g fill="#ffffff">
    <circle cx="35" cy="38" r="1.5" />
    <circle cx="45" cy="35" r="1.5" />
    <circle cx="55" cy="35" r="1.5" />
    <circle cx="65" cy="38" r="1.5" />
    <circle cx="40" cy="58" r="1.5" />
    <circle cx="50" cy="62" r="1.5" />
    <circle cx="60" cy="58" r="1.5" />
    <circle cx="50" cy="68" r="2" />
  </g>
  <circle cx="50" cy="50" r="48" fill="none" stroke="#006400" stroke-width="1" />
</svg>`;

function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderCartaoCNPJToHTML(
  options: RenderCartaoCNPJOptions,
): string {
  const {
    data,
    emitidoEm = new Date(),
    documentId,
    qrCodeDataUrl,
    validationBaseUrl = "www.cnpjaqui.com.br",
  } = options;

  const cnpjFormatado = formatCNPJComplete(data.cnpj);
  const tipoEstabelecimento = isMatriz(data.cnpj) ? "MATRIZ" : "FILIAL";
  const situacaoAtiva = isSituacaoAtiva(data.situacaoCadastral);

  const dataEmissao = emitidoEm.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const horaEmissao = emitidoEm.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const telefoneFormatado = formatPhoneBR(data.telefone);

  const atividadesSecundariasHtml =
    data.atividadesSecundarias && data.atividadesSecundarias.length > 0
      ? `
      <div class="box full-width">
        <span class="label">CODIGO E DESCRICAO DAS ATIVIDADES ECONOMICAS SECUNDARIAS</span>
        ${data.atividadesSecundarias
          .slice(0, 10)
          .map(
            (a) =>
              `<span class="activity-item">${escapeHtml(a.codigo)} - ${escapeHtml(a.descricao)}</span>`,
          )
          .join("")}
        ${
          data.atividadesSecundarias.length > 10
            ? `<span class="activity-item">... e mais ${data.atividadesSecundarias.length - 10} atividade(s)</span>`
            : ""
        }
      </div>
    `
      : "";

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cartao CNPJ</title>
  <style>${CSS_STYLES}</style>
</head>
<body>
  <div class="pdf-page">
    <div class="main-border">
      <!-- Header -->
      <div class="header-container">
        ${BRASAO_SVG}
        <div class="header-text">
          <h1 class="header-title">REPUBLICA FEDERATIVA DO BRASIL</h1>
          <h2 class="header-subtitle">CADASTRO NACIONAL DA PESSOA JURIDICA</h2>
        </div>
        <div class="spacer"></div>
      </div>

      <!-- First Row -->
      <div class="row first-row">
        <div class="box cnpj-box">
          <span class="label">NUMERO DE INSCRICAO</span>
          <span class="value">${escapeHtml(cnpjFormatado)}</span>
          <span class="value-small">${tipoEstabelecimento}</span>
        </div>
        <div class="box document-title-box">
          <span class="document-title">COMPROVANTE DE INSCRICAO<br />E DE SITUACAO CADASTRAL</span>
        </div>
        <div class="box data-abertura-box">
          <span class="label">DATA DE ABERTURA</span>
          <span class="value">${escapeHtml(formatDateBR(data.dataAbertura))}</span>
        </div>
      </div>

      <!-- Nome Empresarial -->
      <div class="box full-width">
        <span class="label">NOME EMPRESARIAL</span>
        <span class="value">${escapeHtml(data.razaoSocial)}</span>
      </div>

      <!-- Nome Fantasia + Porte -->
      <div class="row">
        <div class="box col-85">
          <span class="label">TITULO DO ESTABELECIMENTO (NOME DE FANTASIA)</span>
          <span class="value">${escapeHtml(data.nomeFantasia) || "********"}</span>
        </div>
        <div class="box col-15 no-left-border">
          <span class="label">PORTE</span>
          <span class="value-small">${escapeHtml(data.porte) || "**"}</span>
        </div>
      </div>

      <!-- Atividade Principal -->
      <div class="box full-width">
        <span class="label">CODIGO E DESCRICAO DA ATIVIDADE ECONOMICA PRINCIPAL</span>
        <span class="value">${escapeHtml(data.atividadePrincipal.codigo)} - ${escapeHtml(data.atividadePrincipal.descricao)}</span>
      </div>

      <!-- Atividades Secundarias -->
      ${atividadesSecundariasHtml}

      <!-- Natureza Juridica -->
      <div class="box full-width">
        <span class="label">CODIGO E DESCRICAO DA NATUREZA JURIDICA</span>
        <span class="value">${escapeHtml(data.naturezaJuridica)}</span>
      </div>

      <!-- Endereco: Logradouro, Numero, Complemento -->
      <div class="row">
        <div class="box col-50">
          <span class="label">LOGRADOURO</span>
          <span class="value">${escapeHtml(data.logradouro)}</span>
        </div>
        <div class="box col-14 no-left-border">
          <span class="label">NUMERO</span>
          <span class="value">${escapeHtml(data.numero) || "S/N"}</span>
        </div>
        <div class="box col-36 no-left-border">
          <span class="label">COMPLEMENTO</span>
          <span class="value">${escapeHtml(data.complemento) || "********"}</span>
        </div>
      </div>

      <!-- CEP, Bairro, Municipio, UF -->
      <div class="row">
        <div class="box col-18">
          <span class="label">CEP</span>
          <span class="value">${escapeHtml(formatCEP(data.cep))}</span>
        </div>
        <div class="box col-30 no-left-border">
          <span class="label">BAIRRO/DISTRITO</span>
          <span class="value">${escapeHtml(data.bairro)}</span>
        </div>
        <div class="box col-38 no-left-border">
          <span class="label">MUNICIPIO</span>
          <span class="value">${escapeHtml(data.municipio)}</span>
        </div>
        <div class="box col-14 no-left-border">
          <span class="label">UF</span>
          <span class="value">${escapeHtml(data.uf)}</span>
        </div>
      </div>

      <!-- Email e Telefone -->
      <div class="row">
        <div class="box col-50">
          <span class="label">ENDERECO ELETRONICO</span>
          <span class="value">${escapeHtml(data.email?.toLowerCase()) || "********"}</span>
        </div>
        <div class="box col-50 no-left-border">
          <span class="label">TELEFONE</span>
          <span class="value">${escapeHtml(telefoneFormatado) || "********"}</span>
        </div>
      </div>

      <!-- EFR -->
      <div class="box full-width">
        <span class="label">ENTE FEDERATIVO RESPONSAVEL (EFR)</span>
        <span class="value">${escapeHtml(data.efr) || "********"}</span>
      </div>

      <!-- Situacao Cadastral -->
      <div class="row">
        <div class="box col-75">
          <span class="label">SITUACAO CADASTRAL</span>
          <span class="value ${situacaoAtiva ? "situacao-ativa" : "situacao-inativa"}">${escapeHtml(data.situacaoCadastral)}</span>
        </div>
        <div class="box col-25 no-left-border">
          <span class="label">DATA DA SITUACAO CADASTRAL</span>
          <span class="value">${escapeHtml(formatDateBR(data.dataSituacaoCadastral))}</span>
        </div>
      </div>

      <!-- Motivo Situacao Cadastral -->
      <div class="box full-width">
        <span class="label">MOTIVO DE SITUACAO CADASTRAL</span>
        <span class="value">${escapeHtml(data.motivoSituacaoCadastral) || "********"}</span>
      </div>

      <!-- Situacao Especial -->
      <div class="row">
        <div class="box col-75">
          <span class="label">SITUACAO ESPECIAL</span>
          <span class="value">${escapeHtml(data.situacaoEspecial) || "********"}</span>
        </div>
        <div class="box col-25 no-left-border">
          <span class="label">DATA DA SITUACAO ESPECIAL</span>
          <span class="value">${data.dataSituacaoEspecial ? escapeHtml(formatDateBR(data.dataSituacaoEspecial)) : "********"}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-container">
      <div class="footer-row">
        <div class="emission-column">
          <span class="footer-text">Emitido no dia ${dataEmissao} as ${horaEmissao} (data e hora de Brasilia).</span>
          <span class="footer-text">Pagina: 1/1</span>
        </div>

        <div class="qr-column">
          <img src="${qrCodeDataUrl}" alt="QR Code de Validacao" class="qr-code" />
          <div class="auth-box">
            <span class="auth-text">Autenticidade digital verificada.</span>
            <span class="auth-text">Confirme a validade deste documento em:</span>
            <span class="auth-link">${escapeHtml(validationBaseUrl)}/validar/${escapeHtml(documentId)}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
