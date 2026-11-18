// Funções que as páginas usam para falar com a API Java. Cada uma indica a rota usada.
// Toda regra de negócio (409, validações, ids, datas) é da API: o front só mostra a mensagem dela.

import type {
  Causa,
  Contato,
  ContatoEntrada,
  Dica,
  Id,
  Local,
  LocalEntrada,
  Meta,
  MetaEntrada,
  Recurso,
  Registro,
  RegistroEntrada,
} from "../types";
import { requisicao } from "./api";

/** A API Java espera números nas chaves estrangeiras; no front os ids são texto. */
function idParaApi(id: Id): Id | number {
  return /^\d+$/.test(id) ? Number(id) : id;
}

function registroParaApi(dados: RegistroEntrada) {
  return {
    ...dados,
    localId: idParaApi(dados.localId),
    recursoId: idParaApi(dados.recursoId),
    causaId: idParaApi(dados.causaId),
  };
}

function metaParaApi(dados: MetaEntrada) {
  return {
    ...dados,
    localId: idParaApi(dados.localId),
    recursoId: idParaApi(dados.recursoId),
  };
}

// ---------- Locais ----------
// Java: GET /locais | GET /locais/{id} | POST /locais | PUT /locais/{id} | DELETE /locais/{id}
export const listarLocais = () => requisicao<Local[]>("/locais");

export const buscarLocal = (id: Id) =>
  requisicao<Local>(`/locais/${encodeURIComponent(id)}`);

export function criarLocal(dados: LocalEntrada): Promise<Local> {
  // A API preenche dt_cadastro com a data de hoje.
  return requisicao<Local>("/locais", { metodo: "POST", corpo: dados });
}

export function atualizarLocal(
  atual: Local,
  dados: LocalEntrada,
): Promise<Local> {
  return requisicao<Local>(`/locais/${atual.id}`, {
    metodo: "PUT",
    corpo: { ...dados, dataCadastro: atual.dataCadastro },
  });
}

/** A API responde 409 se o local já tem registros e remove as metas dele junto. */
export const excluirLocal = (id: Id) =>
  requisicao<void>(`/locais/${id}`, { metodo: "DELETE" });

// ---------- Registros de desperdício ----------
// Java: GET/POST /locais/{id}/registros | PUT/DELETE /registros/{id}
export const listarRegistros = (localId: Id) =>
  requisicao<Registro[]>(`/locais/${localId}/registros`);

export const criarRegistro = (dados: RegistroEntrada) =>
  requisicao<Registro>(`/locais/${dados.localId}/registros`, {
    metodo: "POST",
    corpo: registroParaApi(dados),
  });

export const atualizarRegistro = (id: Id, dados: RegistroEntrada) =>
  requisicao<Registro>(`/registros/${id}`, {
    metodo: "PUT",
    corpo: registroParaApi(dados),
  });

export const excluirRegistro = (id: Id) =>
  requisicao<void>(`/registros/${id}`, { metodo: "DELETE" });

// ---------- Metas mensais ----------
// Java: GET/POST /locais/{id}/metas | PUT/DELETE /metas/{id}
export const listarMetas = (localId: Id) =>
  requisicao<Meta[]>(`/locais/${localId}/metas`);

/** A API responde 409 se o local já tem meta para o recurso. */
export const criarMeta = (dados: MetaEntrada) =>
  requisicao<Meta>(`/locais/${dados.localId}/metas`, {
    metodo: "POST",
    corpo: metaParaApi(dados),
  });

export const atualizarMeta = (id: Id, dados: MetaEntrada) =>
  requisicao<Meta>(`/metas/${id}`, {
    metodo: "PUT",
    corpo: metaParaApi(dados),
  });

export const excluirMeta = (id: Id) =>
  requisicao<void>(`/metas/${id}`, { metodo: "DELETE" });

// ---------- Dados de referência (selects, unidades e dicas) ----------
// Java: GET /recursos | GET /causas | GET /dicas?recurso={id}
export const listarRecursos = () => requisicao<Recurso[]>("/recursos");

export const listarCausas = () => requisicao<Causa[]>("/causas");

export const listarDicas = (recursoId: Id) =>
  requisicao<Dica[]>(`/dicas?recurso=${recursoId}`);

// ---------- Contato ----------
// Java: POST /contatos (201 com o contato salvo; 400 se algum campo for inválido)
// A API preenche id, dt_envio (data de hoje) e ds_status (NOVO).
export const criarContato = (dados: ContatoEntrada) =>
  requisicao<Contato>("/contatos", { metodo: "POST", corpo: dados });
