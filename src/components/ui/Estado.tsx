import { useEffect, useState, type ReactNode } from "react";
import Button from "./Button";

/** Mensagem de carregamento enquanto a API responde. */
export function Carregando({ texto = "Carregando..." }: { texto?: string }) {
  // A API no plano gratuito do Render "dorme" sem uso: a primeira chamada pode levar cerca de um minuto.
  const [demorando, setDemorando] = useState(false);
  useEffect(() => {
    const espera = setTimeout(() => setDemorando(true), 5000);
    return () => clearTimeout(espera);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center gap-2 py-16 text-center text-sm text-slate-600"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-oceano-200 border-t-oceano-600 motion-reduce:animate-none"
        />
        {texto}
      </div>
      {demorando && (
        <p className="max-w-sm text-xs text-slate-500">
          A API está acordando. No plano gratuito do Render a primeira resposta
          pode levar cerca de um minuto.
        </p>
      )}
    </div>
  );
}

/** Erro ao carregar, com botão para tentar de novo. */
export function ErroCarregar({
  mensagem,
  onTentarNovamente,
}: {
  mensagem: string;
  onTentarNovamente?: () => void;
}) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-xl rounded-lg border border-alerta/30 bg-alerta-fraco px-5 py-5 text-center"
    >
      <p className="text-sm font-medium text-alerta">{mensagem}</p>
      {onTentarNovamente && (
        <Button
          variante="secundario"
          tamanho="sm"
          className="mt-3"
          onClick={onTentarNovamente}
        >
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

/** Lista vazia: explica o que falta e convida a agir. */
export function Vazio({
  titulo,
  children,
}: {
  titulo: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-linha-forte bg-white px-5 py-10 text-center">
      <p className="font-display text-lg font-semibold text-brand-900">
        {titulo}
      </p>
      {children && (
        <div className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          {children}
        </div>
      )}
    </div>
  );
}
