import { estiloDoRecurso } from "../../data/icones";
import type { UnidadeRecurso } from "../../types";

const caixas = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" } as const;
const icones = { sm: 16, md: 20, lg: 24 } as const;

/** Quadradinho com o ícone do recurso (gota, raio ou trigo), na cor dele. */
export default function IconeRecurso({
  unidade,
  tamanho = "md",
}: {
  unidade: UnidadeRecurso;
  tamanho?: keyof typeof caixas;
}) {
  const { Icone, fundo, texto } = estiloDoRecurso(unidade);
  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center rounded-md ${caixas[tamanho]} ${fundo} ${texto}`}>
      <Icone size={icones[tamanho]} />
    </span>
  );
}
