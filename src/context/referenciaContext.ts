import { createContext } from "react";
import type { Causa, Dica, Id, Recurso } from "../types";

/** Dados de referência (quase não mudam): carregados uma vez e usados em várias páginas. */
export interface ReferenciaValor {
  recursos: Recurso[];
  causas: Causa[];
  dicas: Dica[];
  /** true enquanto os dados chegam da API pela primeira vez. */
  carregando: boolean;
  erro: string | null;
  recarregar: () => void;
  recursoPorId: (id: Id) => Recurso | undefined;
  causaPorId: (id: Id) => Causa | undefined;
  causasDoRecurso: (recursoId: Id) => Causa[];
}

export const ReferenciaContext = createContext<ReferenciaValor | null>(null);
