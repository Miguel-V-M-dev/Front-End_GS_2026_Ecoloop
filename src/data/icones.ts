import type { IconType } from "react-icons";
import { FiDroplet, FiHome, FiShoppingBag, FiUsers, FiZap } from "react-icons/fi";
import { LuWheat } from "react-icons/lu";
import type { TipoLocal, UnidadeRecurso } from "../types";

export const iconeTipo: Record<TipoLocal, IconType> = {
  CASA: FiHome,
  COMUNIDADE: FiUsers,
  NEGOCIO: FiShoppingBag,
};

/** Cor de cada tipo de local (ícone e faixa do cartão). */
export const corTipo: Record<TipoLocal, { fundo: string; texto: string; barra: string }> = {
  CASA: { fundo: "bg-brand-100", texto: "text-brand-700", barra: "bg-brand-500" },
  COMUNIDADE: { fundo: "bg-oceano-100", texto: "text-oceano-700", barra: "bg-oceano-500" },
  NEGOCIO: { fundo: "bg-alimento-fraco", texto: "text-alimento", barra: "bg-alimento" },
};

/** Quatro acentos (verde, azul, amarelo e laranja) que se repetem em listas de itens. */
const acentos = [
  { fundo: "bg-brand-100", texto: "text-brand-700", numero: "text-brand-400", anel: "ring-brand-300", lateral: "border-l-brand-500" },
  { fundo: "bg-oceano-100", texto: "text-oceano-700", numero: "text-oceano-400", anel: "ring-oceano-300", lateral: "border-l-oceano-500" },
  { fundo: "bg-energia-fraco", texto: "text-energia-escuro", numero: "text-energia", anel: "ring-energia/50", lateral: "border-l-energia" },
  { fundo: "bg-alimento-fraco", texto: "text-alimento", numero: "text-alimento", anel: "ring-alimento/40", lateral: "border-l-alimento" },
];

export function acentoDe(indice: number) {
  return acentos[indice % acentos.length];
}

/** Identidade visual de um recurso: ícone, fundo suave, cor do ícone e cor da régua. */
export interface EstiloRecurso {
  Icone: IconType;
  fundo: string;
  texto: string;
  barra: string;
}

const estiloPorUnidade: Record<UnidadeRecurso, EstiloRecurso> = {
  L: { Icone: FiDroplet, fundo: "bg-agua-fraco", texto: "text-agua", barra: "bg-agua" },
  KWH: { Icone: FiZap, fundo: "bg-energia-fraco", texto: "text-energia-escuro", barra: "bg-energia" },
  KG: { Icone: LuWheat, fundo: "bg-alimento-fraco", texto: "text-alimento", barra: "bg-alimento" },
};

const estiloPadrao: EstiloRecurso = {
  Icone: FiDroplet,
  fundo: "bg-brand-50",
  texto: "text-brand-700",
  barra: "bg-brand-500",
};

/** O estilo vem da unidade (L, KWH, KG); um recurso novo, sem estilo próprio, usa o padrão. */
export function estiloDoRecurso(unidade: UnidadeRecurso): EstiloRecurso {
  return estiloPorUnidade[unidade] ?? estiloPadrao;
}
