import { useId } from "react";
import { FiChevronDown } from "react-icons/fi";
import type { FaqEntrada } from "../../types";

interface FaqItemProps {
  entrada: FaqEntrada;
  aberta: boolean;
  onAlternar: () => void;
}

/** Item do acordeão de perguntas frequentes. */
export default function FaqItem({ entrada, aberta, onAlternar }: FaqItemProps) {
  const idPainel = useId();
  return (
    <div
      className={`rounded-lg border border-l-4 border-linha transition-colors ${
        aberta ? "border-l-oceano-500 bg-oceano-50/60" : "border-l-brand-300 bg-white"
      }`}
    >
      <h2>
        <button
          type="button"
          onClick={onAlternar}
          aria-expanded={aberta}
          aria-controls={idPainel}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-brand-900"
        >
          {entrada.pergunta}
          <FiChevronDown
            aria-hidden="true"
            className={`shrink-0 text-oceano-600 transition-transform duration-200 ${aberta ? "rotate-180" : ""}`}
          />
        </button>
      </h2>
      {aberta && (
        <p id={idPainel} className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
          {entrada.resposta}
        </p>
      )}
    </div>
  );
}
