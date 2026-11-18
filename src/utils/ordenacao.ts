import type { Id } from "../types";

/** Compara ids como números quando possível ("2" vem antes de "10"). */
export function compararIds(a: Id, b: Id): number {
  return a.localeCompare(b, "pt-BR", { numeric: true });
}

/** Compara textos ignorando acentos e maiúsculas. */
export function compararNomes(a: string, b: string): number {
  return a.localeCompare(b, "pt-BR", { sensitivity: "base" });
}

/** Minúsculas e sem acento, para a busca achar "padaria pao" em "Padaria Pão Quente". */
export function normalizarBusca(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}
