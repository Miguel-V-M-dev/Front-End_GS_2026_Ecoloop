import { useEffect, useId, useRef, type ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
  largura?: "md" | "lg";
}

const SELETOR_FOCAVEL =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Janela de diálogo controlada por estado no componente pai (useState).
 * Fecha com Esc, mantém o foco dentro dela e devolve o foco ao elemento anterior.
 */
export default function Modal({ aberto, titulo, onFechar, children, largura = "md" }: ModalProps) {
  const painelRef = useRef<HTMLDivElement>(null);
  const onFecharRef = useRef(onFechar);
  const idTitulo = useId();

  // Guarda a função mais recente sem reiniciar o efeito abaixo a cada render do pai.
  useEffect(() => {
    onFecharRef.current = onFechar;
  });

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.activeElement as HTMLElement | null;
    const painel = painelRef.current;
    painel?.focus();

    function aoTeclar(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onFecharRef.current();
        return;
      }
      if (e.key !== "Tab" || !painel) return;
      const focaveis = [...painel.querySelectorAll<HTMLElement>(SELETOR_FOCAVEL)];
      if (focaveis.length === 0) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && (document.activeElement === primeiro || document.activeElement === painel)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", aoTeclar);
    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", aoTeclar);
      document.body.style.overflow = overflowAnterior;
      anterior?.focus();
    };
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-oceano-950/60 p-4"
      onClick={onFechar}
    >
      <div
        ref={painelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`relative my-auto w-full rounded-lg bg-white p-6 shadow-xl outline-none ${
          largura === "lg" ? "max-w-xl" : "max-w-md"
        }`}
      >
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="absolute right-3 top-3 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-tinta"
        >
          <FiX size={20} />
        </button>
        <h2 id={idTitulo} className="pr-8 text-xl font-bold text-brand-900">
          {titulo}
        </h2>
        <div className="mt-4 text-slate-700">{children}</div>
      </div>
    </div>
  );
}
