import type { ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiX } from "react-icons/fi";

interface AvisoProps {
  tipo: "sucesso" | "erro";
  children: ReactNode;
  onFechar?: () => void;
  className?: string;
}

/** Retorno da API para o usuário: sucesso (status) ou erro (alert). */
export default function Aviso({ tipo, children, onFechar, className = "" }: AvisoProps) {
  const erro = tipo === "erro";
  const Icone = erro ? FiAlertCircle : FiCheckCircle;
  return (
    <div
      role={erro ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${
        erro ? "border-alerta/30 bg-alerta-fraco text-alerta" : "border-brand-200 bg-brand-50 text-brand-900"
      } ${className}`}
    >
      <Icone size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
      <div className="flex-1">{children}</div>
      {onFechar && (
        <button
          type="button"
          onClick={onFechar}
          aria-label="Dispensar aviso"
          className="-m-1 rounded p-1 opacity-70 hover:opacity-100"
        >
          <FiX size={16} />
        </button>
      )}
    </div>
  );
}
