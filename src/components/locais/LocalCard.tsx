import { FiMapPin, FiUsers } from "react-icons/fi";
import { Link } from "react-router";
import { corTipo, iconeTipo } from "../../data/icones";
import { rotuloPessoas, rotuloTipo } from "../../data/rotulos";
import type { Local } from "../../types";

/** Cartão de um local na lista. O cartão inteiro leva ao painel (/locais/:id). */
export default function LocalCard({ local }: { local: Local }) {
  const Icone = iconeTipo[local.tipo];
  const cor = corTipo[local.tipo];
  return (
    <Link
      to={`/locais/${local.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-linha bg-white p-5 transition-colors hover:border-oceano-400"
    >
      <div aria-hidden="true" className={`-mx-5 -mt-5 mb-4 h-1.5 ${cor.barra}`} />
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${cor.fundo} ${cor.texto}`}
        >
          <Icone size={20} />
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-semibold leading-snug text-brand-950 group-hover:text-oceano-700">
            {local.nome}
          </h3>
          <p className="text-sm text-slate-500">{rotuloTipo[local.tipo]}</p>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <FiMapPin aria-hidden="true" className={`shrink-0 ${cor.texto}`} />
          {local.bairro}, {local.cidade}
        </p>
        <p className="flex items-center gap-2">
          <FiUsers aria-hidden="true" className={`shrink-0 ${cor.texto}`} />
          {local.qtPessoas} {rotuloPessoas[local.tipo]}
        </p>
      </div>

      <span className="mt-auto pt-4 text-sm font-semibold text-oceano-700 group-hover:underline">Abrir painel</span>
    </Link>
  );
}
