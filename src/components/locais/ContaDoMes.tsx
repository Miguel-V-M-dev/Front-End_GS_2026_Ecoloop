import { estiloDoRecurso } from "../../data/icones";
import { classesNivel, rotuloNivel, rotuloUnidade } from "../../data/rotulos";
import type { Meta, Recurso, ResumoRecurso } from "../../types";
import { formatarCo2, formatarMes, formatarMoeda, formatarNumero } from "../../utils/formatacao";
import Button from "../ui/Button";
import IconeRecurso from "../ui/IconeRecurso";
import Regua from "../ui/Regua";

interface ContaDoMesProps {
  resumo: ResumoRecurso[];
  /** Mês exibido (aaaa-mm) e meses disponíveis para escolher. */
  mes: string;
  meses: string[];
  onMudarMes: (mes: string) => void;
  onAjustarMeta: (recurso: Recurso, meta: Meta | null) => void;
}

/**
 * "Conta do mês": uma linha por recurso com o total desperdiçado, a régua contra a meta,
 * o custo e o CO₂ estimados. Lembra uma conta de consumo, só que do que se perdeu.
 */
export default function ContaDoMes({ resumo, mes, meses, onMudarMes, onAjustarMeta }: ContaDoMesProps) {
  const custoTotal = resumo.reduce((soma, item) => soma + item.custo, 0);
  const co2Total = resumo.reduce((soma, item) => soma + item.co2, 0);

  return (
    <section aria-labelledby="titulo-conta" className="rounded-lg border border-linha bg-white">
      <header className="flex flex-wrap items-end justify-between gap-4 rounded-t-lg border-b border-linha bg-gradient-to-r from-brand-50 to-oceano-50 px-5 py-4 sm:px-6">
        <div>
          <h2 id="titulo-conta" className="text-xl font-bold text-brand-950">
            Conta do mês
          </h2>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <label htmlFor="mes-conta">Mês de referência</label>
            <select
              id="mes-conta"
              value={mes}
              onChange={(e) => onMudarMes(e.target.value)}
              className="rounded-md border border-linha-forte bg-white px-2.5 py-1 text-sm font-semibold text-brand-900"
            >
              {meses.map((m) => (
                <option key={m} value={m}>
                  {formatarMes(m)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <dl className="flex gap-8">
          <div>
            <dt className="text-xs text-slate-500">Custo estimado</dt>
            <dd className="font-display text-xl font-bold tabular-nums text-brand-950">{formatarMoeda(custoTotal)}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">CO₂ estimado</dt>
            <dd className="font-display text-xl font-bold tabular-nums text-brand-950">{formatarCo2(co2Total)}</dd>
          </div>
        </dl>
      </header>

      <ul className="divide-y divide-linha px-5 sm:px-6">
        {resumo.map((item) => (
          <LinhaRecurso key={item.recurso.id} item={item} onAjustarMeta={onAjustarMeta} />
        ))}
      </ul>
    </section>
  );
}

function LinhaRecurso({ item, onAjustarMeta }: { item: ResumoRecurso; onAjustarMeta: ContaDoMesProps["onAjustarMeta"] }) {
  const { recurso, total, qtRegistros, meta, pctMeta, nivel, custo, co2 } = item;
  const unidade = rotuloUnidade[recurso.unidade];
  const descricao = meta
    ? `${recurso.nome}: ${formatarNumero(total)} ${unidade} de ${formatarNumero(meta.metaMensal)} ${unidade}`
    : `${recurso.nome}: ${formatarNumero(total)} ${unidade}, sem meta definida`;

  return (
    <li className="grid gap-x-6 gap-y-3 py-5 md:grid-cols-[11rem_minmax(0,1fr)_10rem] md:items-center">
      <div className="flex items-center gap-3">
        <IconeRecurso unidade={recurso.unidade} />
        <div>
          <p className="font-display text-lg font-semibold leading-tight text-brand-950">{recurso.nome}</p>
          <p className="text-xs text-slate-500">
            {qtRegistros === 0 ? "Nenhum registro" : `${qtRegistros} ${qtRegistros === 1 ? "registro" : "registros"}`}
          </p>
        </div>
      </div>

      <div>
        <Regua
          total={total}
          meta={meta?.metaMensal ?? null}
          corClasse={estiloDoRecurso(recurso.unidade).barra}
          descricao={descricao}
          rotuloMeta={meta ? `meta ${formatarNumero(meta.metaMensal)} ${unidade}` : undefined}
        />
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 font-semibold ring-1 ring-inset ${classesNivel[nivel]}`}>
            {rotuloNivel[nivel]}
          </span>
          {pctMeta !== null && <span className="font-semibold tabular-nums">{formatarNumero(pctMeta, 1)}% da meta</span>}
          <span>Custo {formatarMoeda(custo)}</span>
          <span>CO₂ {formatarCo2(co2)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
        <p className="font-display text-3xl font-bold leading-none tabular-nums text-brand-950">
          {formatarNumero(total)}
          <span className="ml-1 text-sm font-medium text-slate-500">{unidade}</span>
        </p>
        <Button variante="texto" tamanho="sm" onClick={() => onAjustarMeta(recurso, meta)}>
          {meta ? "Ajustar meta" : "Definir meta"}
        </Button>
      </div>
    </li>
  );
}
