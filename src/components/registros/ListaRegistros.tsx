import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useReferencia } from "../../context/useReferencia";
import { rotuloUnidade } from "../../data/rotulos";
import type { Registro } from "../../types";
import { formatarData, formatarNumero } from "../../utils/formatacao";
import Button from "../ui/Button";
import IconeRecurso from "../ui/IconeRecurso";

const QUANTIDADE_INICIAL = 8;

interface ListaRegistrosProps {
  /** Já ordenados do mais recente para o mais antigo. */
  registros: Registro[];
  onEditar: (registro: Registro) => void;
  onExcluir: (registro: Registro) => void;
}

/** Histórico de registros do local, com editar (PUT) e excluir (DELETE) em cada linha. */
export default function ListaRegistros({ registros, onEditar, onExcluir }: ListaRegistrosProps) {
  const { recursoPorId, causaPorId } = useReferencia();
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const visiveis = mostrarTodos ? registros : registros.slice(0, QUANTIDADE_INICIAL);

  return (
    <div>
      <ul className="divide-y divide-linha rounded-lg border border-linha bg-white px-5">
        {visiveis.map((registro) => {
          const recurso = recursoPorId(registro.recursoId);
          const causa = causaPorId(registro.causaId);
          const dataTexto = formatarData(registro.data);
          return (
            <li key={registro.id} className="grid gap-2 py-4 sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
              <p className="text-sm font-semibold tabular-nums text-slate-700">{dataTexto}</p>

              <div className="flex min-w-0 items-start gap-3">
                {recurso && <IconeRecurso unidade={recurso.unidade} tamanho="sm" />}
                <div className="min-w-0">
                  <p className="font-semibold leading-snug text-brand-950">{causa?.nome ?? "Causa não encontrada"}</p>
                  <p className="text-sm text-slate-500">
                    {recurso?.nome}
                    {registro.observacao ? `: ${registro.observacao}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <p className="font-display text-lg font-bold tabular-nums text-brand-950">
                  {formatarNumero(registro.quantidade)}
                  <span className="ml-1 text-sm font-medium text-slate-500">
                    {recurso ? rotuloUnidade[recurso.unidade] : ""}
                  </span>
                </p>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => onEditar(registro)}
                    aria-label={`Editar registro de ${dataTexto}`}
                    className="rounded-md p-2 text-slate-500 hover:bg-oceano-50 hover:text-oceano-700"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onExcluir(registro)}
                    aria-label={`Excluir registro de ${dataTexto}`}
                    className="rounded-md p-2 text-slate-500 hover:bg-alerta-fraco hover:text-alerta"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {registros.length > QUANTIDADE_INICIAL && (
        <div className="mt-3 text-center">
          <Button variante="texto" tamanho="sm" onClick={() => setMostrarTodos((atual) => !atual)}>
            {mostrarTodos ? "Mostrar menos" : `Mostrar todos (${registros.length})`}
          </Button>
        </div>
      )}
    </div>
  );
}
