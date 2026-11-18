import { formatarNumero } from "../../utils/formatacao";

interface ReguaProps {
  total: number;
  /** Meta mensal (teto). Sem meta, a régua aparece vazia e tracejada. */
  meta: number | null;
  /** Classe de cor do preenchimento (identidade do recurso), ex.: "bg-agua". */
  corClasse: string;
  /** Texto para leitores de tela, ex.: "Água: 80 L de 300 L". */
  descricao: string;
  /** Texto do fim da régua, ex.: "meta 300 L". */
  rotuloMeta?: string;
}

/**
 * Barra de progresso do total contra a meta, feita só com Tailwind (sem biblioteca de gráfico).
 * Preenche até 100%; se o total passa da meta, a barra inteira fica vermelha.
 * As marcas a cada 25% lembram uma régua.
 */
export default function Regua({ total, meta, corClasse, descricao, rotuloMeta }: ReguaProps) {
  const pct = meta ? (total / meta) * 100 : 0;
  const estourou = meta !== null && total > meta;
  const largura = Math.min(pct, 100);

  return (
    <div>
      <div
        role="progressbar"
        aria-label={descricao}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={meta === null ? undefined : Math.round(largura)}
        aria-valuetext={meta === null ? "Sem meta definida" : `${formatarNumero(pct, 1)}% da meta`}
        className={`relative h-3.5 overflow-hidden rounded-sm ${
          meta === null ? "border border-dashed border-linha-forte bg-white" : "bg-oceano-50 ring-1 ring-inset ring-oceano-200/80"
        }`}
      >
        {meta !== null && (
          <div
            className={`h-full transition-[width] duration-500 motion-reduce:transition-none ${
              estourou ? "bg-alerta" : corClasse
            }`}
            style={{ width: `${largura}%` }}
          />
        )}
        {meta !== null &&
          [25, 50, 75].map((marca) => (
            <span
              key={marca}
              aria-hidden="true"
              className="absolute inset-y-0 w-px bg-white/80"
              style={{ left: `${marca}%` }}
            />
          ))}
      </div>
      <div className="mt-1 flex justify-between text-xs text-slate-500">
        <span>0</span>
        <span>{rotuloMeta ?? (meta === null ? "sem meta" : "")}</span>
      </div>
    </div>
  );
}
