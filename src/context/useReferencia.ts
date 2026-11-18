import { useContext } from "react";
import { ReferenciaContext, type ReferenciaValor } from "./referenciaContext";

export function useReferencia(): ReferenciaValor {
  const contexto = useContext(ReferenciaContext);
  if (!contexto) throw new Error("useReferencia deve ser usado dentro de <ReferenciaProvider>.");
  return contexto;
}
