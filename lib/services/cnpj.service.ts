import { createLogger } from "@/lib/logger";
import { maskCNPJ } from "../utils";

const logger = createLogger("cnpj-service");

export interface QsaSocio {
  nome: string;
  qualificacao: string;
  cpf?: string;
  faixaEtaria?: string;
  dataEntrada?: string;
}

export interface CnpjData {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  dataAbertura: string;
  porte: string;
  naturezaJuridica: string;
  atividadePrincipal: {
    codigo: string;
    descricao: string;
  };
  atividadesSecundarias: Array<{
    codigo: string;
    descricao: string;
  }>;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
  email: string;
  telefone: string;
  situacaoCadastral: string;
  dataSituacaoCadastral: string;
  motivoSituacaoCadastral: string;
  situacaoEspecial?: string;
  dataSituacaoEspecial?: string;
  efr?: string;
  qsa?: QsaSocio[];
  capitalSocial?: number;
}

interface BrasilApiQsa {
  nome_socio?: string;
  codigo_qualificacao_socio?: number;
  qualificacao_socio?: string;
  cpf_cnpj_socio?: string;
  faixa_etaria?: string;
  data_entrada_sociedade?: string;
}

interface BrasilApiResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  data_inicio_atividade: string;
  porte: string;
  natureza_juridica: string;
  cnae_fiscal: string;
  cnae_fiscal_descricao: string;
  cnaes_secundarios: Array<{
    codigo: number;
    descricao: string;
  }>;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
  email: string;
  ddd_telefone_1: string;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: string;
  situacao_especial?: string;
  data_situacao_especial?: string;
  ente_federativo_responsavel?: string;
  qsa?: BrasilApiQsa[];
  capital_social?: number;
}

interface ReceitaWsResponse {
  cnpj: string;
  nome: string;
  fantasia: string;
  abertura: string;
  porte: string;
  natureza_juridica: string;
  atividade_principal: Array<{
    code: string;
    text: string;
  }>;
  atividades_secundarias: Array<{
    code: string;
    text: string;
  }>;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  municipio: string;
  uf: string;
  email: string;
  telefone: string;
  situacao: string;
  data_situacao: string;
  motivo_situacao: string;
  situacao_especial?: string;
  data_situacao_especial?: string;
  efr?: string;
  capital_social?: string;
}

function normalizeBrasilApi(data: BrasilApiResponse): CnpjData {
  return {
    cnpj: data.cnpj,
    razaoSocial: data.razao_social || "",
    nomeFantasia: data.nome_fantasia || "",
    dataAbertura: data.data_inicio_atividade || "",
    porte: data.porte || "",
    naturezaJuridica: data.natureza_juridica || "",
    atividadePrincipal: {
      codigo: data.cnae_fiscal || "",
      descricao: data.cnae_fiscal_descricao || "",
    },
    atividadesSecundarias:
      data.cnaes_secundarios?.map((cnae) => ({
        codigo: String(cnae.codigo),
        descricao: cnae.descricao,
      })) || [],
    logradouro: data.logradouro || "",
    numero: data.numero || "",
    complemento: data.complemento || "",
    bairro: data.bairro || "",
    cep: data.cep || "",
    municipio: data.municipio || "",
    uf: data.uf || "",
    email: data.email || "",
    telefone: data.ddd_telefone_1 || "",
    situacaoCadastral: data.descricao_situacao_cadastral || "",
    dataSituacaoCadastral: data.data_situacao_cadastral || "",
    motivoSituacaoCadastral: data.motivo_situacao_cadastral || "",
    situacaoEspecial: data.situacao_especial,
    dataSituacaoEspecial: data.data_situacao_especial,
    efr: data.ente_federativo_responsavel,
    qsa: data.qsa?.map((socio) => ({
      nome: socio.nome_socio || "",
      qualificacao: socio.qualificacao_socio || "",
      cpf: socio.cpf_cnpj_socio,
      faixaEtaria: socio.faixa_etaria,
      dataEntrada: socio.data_entrada_sociedade,
    })),
    capitalSocial: data.capital_social,
  };
}

function normalizeReceitaWs(data: ReceitaWsResponse): CnpjData {
  return {
    cnpj: data.cnpj,
    razaoSocial: data.nome || "",
    nomeFantasia: data.fantasia || "",
    dataAbertura: data.abertura || "",
    porte: data.porte || "",
    naturezaJuridica: data.natureza_juridica || "",
    atividadePrincipal: {
      codigo: data.atividade_principal?.[0]?.code || "",
      descricao: data.atividade_principal?.[0]?.text || "",
    },
    atividadesSecundarias:
      data.atividades_secundarias?.map((atividade) => ({
        codigo: atividade.code,
        descricao: atividade.text,
      })) || [],
    logradouro: data.logradouro || "",
    numero: data.numero || "",
    complemento: data.complemento || "",
    bairro: data.bairro || "",
    cep: data.cep || "",
    municipio: data.municipio || "",
    uf: data.uf || "",
    email: data.email || "",
    telefone: data.telefone || "",
    situacaoCadastral: data.situacao || "",
    dataSituacaoCadastral: data.data_situacao || "",
    motivoSituacaoCadastral: data.motivo_situacao || "",
    situacaoEspecial: data.situacao_especial,
    dataSituacaoEspecial: data.data_situacao_especial,
    efr: data.efr,
    capitalSocial: data.capital_social
      ? parseFloat(data.capital_social.replace(/[^\d,]/g, "").replace(",", "."))
      : undefined,
  };
}

export async function queryCNPJ(cnpj: string): Promise<CnpjData> {
  const cleanedCNPJ = cnpj.replace(/\D/g, "");
  const cnpjMasked = maskCNPJ(cleanedCNPJ);

  let cnpjData: CnpjData | null = null;

  // Tenta BrasilAPI primeiro (tem QSA completo)
  try {
    logger.info({ cnpj: cnpjMasked }, "Consultando CNPJ via BrasilAPI");

    const brasilApiUrl = `https://brasilapi.com.br/api/cnpj/v1/${cleanedCNPJ}`;
    const brasilApiResponse = await fetch(brasilApiUrl, {
      headers: {
        "User-Agent": "CNPJ-Aqui/1.0",
      },
    });

    if (brasilApiResponse.ok) {
      const data = (await brasilApiResponse.json()) as BrasilApiResponse;
      cnpjData = normalizeBrasilApi(data);
      logger.info(
        { cnpj: cnpjMasked },
        "CNPJ consultado com sucesso via BrasilAPI",
      );
    } else {
      logger.warn(
        { cnpj: cnpjMasked, status: brasilApiResponse.status },
        "BrasilAPI falhou",
      );
    }
  } catch (error) {
    logger.error(
      { error, cnpj: cnpjMasked, api: "BrasilAPI" },
      "Erro ao consultar BrasilAPI",
    );
  }

  // Se BrasilAPI retornou dados mas email está vazio, busca email na ReceitaWS
  if (cnpjData && !cnpjData.email) {
    try {
      logger.info(
        { cnpj: cnpjMasked },
        "Email vazio, buscando complemento na ReceitaWS",
      );

      const receitaWsUrl = `https://www.receitaws.com.br/v1/cnpj/${cleanedCNPJ}`;
      const receitaWsResponse = await fetch(receitaWsUrl, {
        headers: {
          "User-Agent": "CNPJ-Aqui/1.0",
        },
      });

      if (receitaWsResponse.ok) {
        const receitaData =
          (await receitaWsResponse.json()) as ReceitaWsResponse;
        // Complementa apenas o email se vier preenchido
        if (receitaData.email) {
          cnpjData.email = receitaData.email;
          logger.info(
            { cnpj: cnpjMasked },
            "Email complementado via ReceitaWS",
          );
        }
      }
    } catch (error) {
      logger.warn(
        { error, cnpj: cnpjMasked },
        "Erro ao buscar email na ReceitaWS (não crítico)",
      );
    }
  }

  // Se BrasilAPI funcionou, retorna os dados (com ou sem email complementado)
  if (cnpjData) {
    return cnpjData;
  }

  // Fallback: se BrasilAPI falhou completamente, tenta ReceitaWS
  try {
    logger.info(
      { cnpj: cnpjMasked },
      "Consultando CNPJ via ReceitaWS (fallback completo)",
    );

    const receitaWsUrl = `https://www.receitaws.com.br/v1/cnpj/${cleanedCNPJ}`;
    const receitaWsResponse = await fetch(receitaWsUrl, {
      headers: {
        "User-Agent": "CNPJ-Aqui/1.0",
      },
    });

    if (!receitaWsResponse.ok) {
      logger.error(
        {
          cnpj: cnpjMasked,
          status: receitaWsResponse.status,
          api: "ReceitaWS",
        },
        "ReceitaWS retornou status de erro",
      );
      throw new Error(`ReceitaWS retornou status ${receitaWsResponse.status}`);
    }

    const data = (await receitaWsResponse.json()) as ReceitaWsResponse;

    if (data.cnpj) {
      logger.info(
        { cnpj: cnpjMasked },
        "CNPJ consultado com sucesso via ReceitaWS",
      );
      return normalizeReceitaWs(data);
    }

    logger.error(
      { cnpj: cnpjMasked, api: "ReceitaWS" },
      "ReceitaWS não retornou dados válidos",
    );
    throw new Error("ReceitaWS não retornou dados válidos");
  } catch (error) {
    logger.error(
      { error, cnpj: cnpjMasked, api: "ReceitaWS" },
      "Erro ao consultar CNPJ via ReceitaWS",
    );
    throw new Error(
      "Não foi possível consultar o CNPJ. Tente novamente mais tarde.",
    );
  }
}
