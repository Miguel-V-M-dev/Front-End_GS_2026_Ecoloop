import type { Causa, CausaFrequente, Meta, NivelMeta, Recurso, Registro, ResumoRecurso } from "../types";
import { mesAtual, mesDe } from "./formatacao";

/** A partir deste percentual da meta o painel avisa que o limite está perto. */
export const LIMITE_ATENCAO_PCT = 80;

/** Evita 1.9000000000000001: os valores do banco têm no máximo 2 casas decimais. */
export function arredondar(valor: number, casas = 2): number {
  const fator = 10 ** casas;
  return Math.round(valor * fator) / fator;
}

/**
 * Situação do total em relação à meta. A meta é um TETO: passou de 100% estourou
 * (mesmo critério da consulta 04 do SQL: SUM > meta).
 */
export function nivelDaMeta(total: number, meta: number | null): NivelMeta {
  if (meta === null) return "SEM_META";
  const pct = (total / meta) * 100;
  if (pct > 100) return "ESTOUROU";
  if (pct >= LIMITE_ATENCAO_PCT) return "PERTO";
  return "DENTRO";
}

/** Total, meta, custo e CO₂ de cada recurso em um mês (aaaa-mm). */
export function resumirMes(recursos: Recurso[], registros: Registro[], metas: Meta[], mes: string): ResumoRecurso[] {
  return recursos.map((recurso) => {
    const doMes = registros.filter((r) => r.recursoId === recurso.id && mesDe(r.data) === mes);
    const total = arredondar(doMes.reduce((soma, r) => soma + r.quantidade, 0));
    const meta = metas.find((m) => m.recursoId === recurso.id) ?? null;
    const pctMeta = meta ? (total / meta.metaMensal) * 100 : null;
    return {
      recurso,
      total,
      qtRegistros: doMes.length,
      meta,
      pctMeta,
      nivel: nivelDaMeta(total, meta?.metaMensal ?? null),
      custo: total * recurso.custoUnitario,
      co2: total * recurso.fatorCo2,
    };
  });
}

/** Meses (aaaa-mm) com registros, mais o mês atual, do mais recente para o mais antigo. */
export function listarMeses(registros: Registro[]): string[] {
  const meses = new Set(registros.map((r) => mesDe(r.data)));
  meses.add(mesAtual());
  return [...meses].sort().reverse();
}

/** Mês atual se tiver registros; senão o mês do registro mais recente; senão o mês atual. */
export function mesPadrao(registros: Registro[]): string {
  const atual = mesAtual();
  if (registros.some((r) => mesDe(r.data) === atual)) return atual;
  const recentes = registros.map((r) => mesDe(r.data)).sort();
  return recentes[recentes.length - 1] ?? atual;
}

/** Mais recentes primeiro (data e, no empate, o id maior). */
export function ordenarRegistros(registros: Registro[]): Registro[] {
  return [...registros].sort(
    (a, b) => b.data.localeCompare(a.data) || b.id.localeCompare(a.id, "pt-BR", { numeric: true }),
  );
}

/** Causas mais frequentes do mês (consulta 05 do SQL, restrita a um local). */
export function causasFrequentes(
  registros: Registro[],
  causas: Causa[],
  recursos: Recurso[],
  mes: string,
): CausaFrequente[] {
  const porCausa = new Map<string, { ocorrencias: number; total: number }>();
  for (const r of registros) {
    if (mesDe(r.data) !== mes) continue;
    const atual = porCausa.get(r.causaId) ?? { ocorrencias: 0, total: 0 };
    porCausa.set(r.causaId, { ocorrencias: atual.ocorrencias + 1, total: atual.total + r.quantidade });
  }
  const lista: CausaFrequente[] = [];
  for (const [causaId, dados] of porCausa) {
    const causa = causas.find((c) => c.id === causaId);
    if (!causa) continue;
    lista.push({ causa, recurso: recursos.find((r) => r.id === causa.recursoId), ...dados });
  }
  return lista.sort((a, b) => b.ocorrencias - a.ocorrencias || b.total - a.total);
}
