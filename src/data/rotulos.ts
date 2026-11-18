import type { NivelMeta, TipoLocal, UnidadeRecurso } from "../types";

export const TIPOS_LOCAL: TipoLocal[] = ["CASA", "COMUNIDADE", "NEGOCIO"];

// A API guarda o valor sem acento (CHECK do banco); aqui só o rótulo exibido.
export const rotuloTipo: Record<TipoLocal, string> = {
  CASA: "Casa",
  COMUNIDADE: "Comunidade",
  NEGOCIO: "Negócio",
};

export const rotuloTipoPlural: Record<TipoLocal, string> = {
  CASA: "Casas",
  COMUNIDADE: "Comunidades",
  NEGOCIO: "Negócios",
};

// A coluna qt_pessoas muda de sentido conforme o tipo do local.
export const rotuloPessoas: Record<TipoLocal, string> = {
  CASA: "moradores",
  COMUNIDADE: "moradores",
  NEGOCIO: "funcionários",
};

export const rotuloUnidade: Record<UnidadeRecurso, string> = {
  L: "L",
  KWH: "kWh",
  KG: "kg",
};

export const unidadePorExtenso: Record<UnidadeRecurso, string> = {
  L: "litro",
  KWH: "quilowatt-hora",
  KG: "quilo",
};

export const rotuloNivel: Record<NivelMeta, string> = {
  SEM_META: "Sem meta",
  DENTRO: "Dentro da meta",
  PERTO: "Perto do limite",
  ESTOUROU: "Meta estourada",
};

export const classesNivel: Record<NivelMeta, string> = {
  SEM_META: "bg-slate-100 text-slate-600 ring-slate-200",
  DENTRO: "bg-brand-50 text-brand-800 ring-brand-200",
  PERTO: "bg-energia-fraco text-energia-escuro ring-energia/40",
  ESTOUROU: "bg-alerta-fraco text-alerta ring-alerta/30",
};
