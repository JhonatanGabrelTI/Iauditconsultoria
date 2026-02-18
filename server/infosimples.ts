import axios from "axios";

const INFOSIMPLES_API_TOKEN = process.env.INFOSIMPLES_API_TOKEN;
const BASE_URL = "https://api.infosimples.com/api/v2/consultas";

if (!INFOSIMPLES_API_TOKEN) {
  console.warn("[InfoSimples] API token not configured");
}

export interface CNDFederalResponse {
  code: number;
  code_message: string;
  data?: {
    situacao?: string;
    cnpj?: string;
    razao_social?: string;
    numero_certidao?: string;
    data_emissao?: string;
    data_validade?: string;
  };
}

export interface CNDEstadualResponse {
  code: number;
  code_message: string;
  data?: {
    situacao?: string;
    inscricao_estadual?: string;
    razao_social?: string;
    numero_certidao?: string;
    data_emissao?: string;
    data_validade?: string;
  };
}

export interface RegularidadeFGTSResponse {
  code: number;
  code_message: string;
  data?: {
    situacao?: string;
    cnpj?: string;
    razao_social?: string;
    numero_crf?: string;
    data_emissao?: string;
    data_validade?: string;
  };
}

/**
 * Consulta CND Federal (PGFN) via InfoSimples
 */
export async function consultarCNDFederal(cnpj: string): Promise<CNDFederalResponse> {
  if (!INFOSIMPLES_API_TOKEN) {
    throw new Error("InfoSimples API token not configured");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/receita-federal/pgfn/nova`,
      {
        cnpj: cnpj.replace(/\D/g, ""), // Remove formatação
        token: INFOSIMPLES_API_TOKEN,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 segundos
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("[InfoSimples] Erro ao consultar CND Federal:", error.message);
    throw new Error(`Erro ao consultar CND Federal: ${error.message}`);
  }
}

/**
 * Consulta CND Estadual PR (SEFAZ) via InfoSimples
 */
export async function consultarCNDEstadual(
  inscricaoEstadual: string,
  cnpj?: string
): Promise<CNDEstadualResponse> {
  if (!INFOSIMPLES_API_TOKEN) {
    throw new Error("InfoSimples API token not configured");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/sefaz/pr/certidao-debitos`,
      {
        inscricao_estadual: inscricaoEstadual,
        cnpj: cnpj ? cnpj.replace(/\D/g, "") : undefined,
        token: INFOSIMPLES_API_TOKEN,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("[InfoSimples] Erro ao consultar CND Estadual:", error.message);
    throw new Error(`Erro ao consultar CND Estadual: ${error.message}`);
  }
}

/**
 * Consulta Regularidade FGTS (Caixa) via InfoSimples
 */
export async function consultarRegularidadeFGTS(cnpj: string): Promise<RegularidadeFGTSResponse> {
  if (!INFOSIMPLES_API_TOKEN) {
    throw new Error("InfoSimples API token not configured");
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/caixa/regularidade`,
      {
        cnpj: cnpj.replace(/\D/g, ""),
        token: INFOSIMPLES_API_TOKEN,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("[InfoSimples] Erro ao consultar Regularidade FGTS:", error.message);
    throw new Error(`Erro ao consultar Regularidade FGTS: ${error.message}`);
  }
}

/**
 * Valida se o token está configurado corretamente
 */
export function isInfoSimplesConfigured(): boolean {
  return !!INFOSIMPLES_API_TOKEN;
}
