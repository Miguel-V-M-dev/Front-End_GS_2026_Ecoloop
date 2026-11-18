// Cliente HTTP do Ecoloop. Centraliza a URL base, o tratamento de erros e a conversão
// dos ids. Nenhuma página chama `fetch` diretamente: tudo passa por aqui.

/**
 * URL base da API Java (Spring Boot) publicada no Render. Para usar outra (ex.: a API rodando
 * em http://localhost:8080), defina VITE_API_URL em um arquivo .env.
 */
export const API_URL = (
  import.meta.env.VITE_API_URL ??
  "https://api-java-global-solution-fiap.onrender.com"
).replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type Metodo = "GET" | "POST" | "PUT" | "DELETE";

interface Opcoes {
  metodo?: Metodo;
  corpo?: unknown;
}

const MENSAGEM_POR_STATUS: Record<number, string> = {
  400: "Os dados enviados são inválidos. Revise os campos e tente de novo.",
  404: "Não encontramos o que você procurou. Ele pode ter sido excluído.",
  409: "Essa operação conflita com dados que já existem.",
};

function mensagemPadrao(status: number): string {
  if (MENSAGEM_POR_STATUS[status]) return MENSAGEM_POR_STATUS[status];
  if (status >= 500)
    return "O servidor encontrou um problema. Tente de novo em instantes.";
  return `Erro inesperado (${status}).`;
}

/** Lê a mensagem do corpo de erro da API Java: { status, message }. */
function extrairMensagem(dados: unknown, status: number): string {
  if (dados && typeof dados === "object") {
    const corpo = dados as Record<string, unknown>;
    for (const campo of ["message", "mensagem", "erro", "error"]) {
      const valor = corpo[campo];
      if (typeof valor === "string" && valor.trim()) {
        return valor;
      }
    }
  }
  return mensagemPadrao(status);
}

/**
 * Converte `id` e `algumId` numéricos da API Java em texto. Assim o front compara ids
 * sempre como texto (ex.: o valor de um <select>).
 */
function normalizarIds(valor: unknown): unknown {
  if (Array.isArray(valor)) return valor.map(normalizarIds);
  if (valor && typeof valor === "object") {
    return Object.fromEntries(
      Object.entries(valor).map(([chave, conteudo]) => [
        chave,
        (chave === "id" || chave.endsWith("Id")) && typeof conteudo === "number"
          ? String(conteudo)
          : normalizarIds(conteudo),
      ]),
    );
  }
  return valor;
}

export async function requisicao<T>(
  caminho: string,
  { metodo = "GET", corpo }: Opcoes = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (corpo !== undefined) headers["Content-Type"] = "application/json";

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      method: metodo,
      headers,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ApiError(
      "Não foi possível conectar à API. Verifique sua conexão e tente de novo.",
      0,
    );
  }

  // 204 (DELETE da API Java) e respostas sem corpo chegam aqui com texto vazio.
  const texto = await resposta.text();
  let dados: unknown;
  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = undefined;
    }
  }

  if (!resposta.ok)
    throw new ApiError(
      extrairMensagem(dados, resposta.status),
      resposta.status,
    );
  return normalizarIds(dados) as T;
}
