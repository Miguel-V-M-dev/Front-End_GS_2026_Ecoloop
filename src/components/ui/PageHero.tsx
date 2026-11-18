import type { ReactNode } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router";
import AnelDecor from "./AnelDecor";

interface PageHeroProps {
  titulo: string;
  children?: ReactNode;
  /** Botões ao lado do título. */
  acoes?: ReactNode;
  voltarPara?: { to: string; rotulo: string };
}

/** Cabeçalho de página: título à esquerda, ações à direita e a faixa de régua embaixo. */
export default function PageHero({ titulo, children, acoes, voltarPara }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-oceano-100 bg-gradient-to-br from-brand-50 via-white to-oceano-100">
      <AnelDecor className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 text-oceano-200/60" />
      <AnelDecor className="pointer-events-none absolute right-4 top-12 hidden h-36 w-36 text-brand-200/70 sm:block" />
      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-8 sm:px-6 sm:pt-10">
        {voltarPara && (
          <Link
            to={voltarPara.to}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-oceano-700 hover:underline"
          >
            <FiArrowLeft aria-hidden="true" /> {voltarPara.rotulo}
          </Link>
        )}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand-950 sm:text-4xl">{titulo}</h1>
            {children && <div className="mt-3 space-y-2 text-base leading-relaxed text-slate-600">{children}</div>}
          </div>
          {acoes && <div className="flex flex-wrap gap-3">{acoes}</div>}
        </div>
      </div>
    </section>
  );
}
