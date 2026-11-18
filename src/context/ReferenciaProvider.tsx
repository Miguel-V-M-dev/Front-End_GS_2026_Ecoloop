import { useMemo, type ReactNode } from "react";
import { useApi } from "../hooks/useApi";
import { listarCausas, listarDicas, listarRecursos } from "../services/ecoloopService";
import { compararIds } from "../utils/ordenacao";
import { ReferenciaContext, type ReferenciaValor } from "./referenciaContext";

// Fora do componente para ter sempre a mesma identidade entre renders.
async function carregarReferencia() {
  const [recursos, causas] = await Promise.all([listarRecursos(), listarCausas()]);
  const dicas = (await Promise.all(recursos.map((recurso) => listarDicas(recurso.id)))).flat();
  return {
    recursos: [...recursos].sort((a, b) => compararIds(a.id, b.id)),
    causas: [...causas].sort((a, b) => compararIds(a.id, b.id)),
    dicas: [...dicas].sort((a, b) => compararIds(a.id, b.id)),
  };
}

/** Disponibiliza recursos, causas e dicas para o app todo (useContext). */
export default function ReferenciaProvider({ children }: { children: ReactNode }) {
  const { dados, erro, carregando, recarregar } = useApi(carregarReferencia, "referencia");

  const valor = useMemo<ReferenciaValor>(() => {
    const recursos = dados?.recursos ?? [];
    const causas = dados?.causas ?? [];
    return {
      recursos,
      causas,
      dicas: dados?.dicas ?? [],
      carregando,
      erro: dados ? null : (erro ?? null),
      recarregar,
      recursoPorId: (id) => recursos.find((recurso) => recurso.id === id),
      causaPorId: (id) => causas.find((causa) => causa.id === id),
      causasDoRecurso: (recursoId) => causas.filter((causa) => causa.recursoId === recursoId),
    };
  }, [dados, erro, carregando, recarregar]);

  return <ReferenciaContext.Provider value={valor}>{children}</ReferenciaContext.Provider>;
}
