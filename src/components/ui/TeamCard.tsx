import { FiGithub, FiLinkedin } from "react-icons/fi";
import type { Integrante } from "../../types";
import Card from "./Card";

/** Card de um integrante da equipe. */
export default function TeamCard({ integrante }: { integrante: Integrante }) {
  return (
    <Card className="h-full w-full flex flex-col items-center text-center">
      <img
        src={integrante.foto}
        alt={`Foto de ${integrante.nome}`}
        className="mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-oceano-200"
      />
      <h2 className="flex min-h-14 items-center text-lg font-bold leading-7 text-brand-900">
        {integrante.nome}
      </h2>
      <p
        className="mt-1 rounded-full bg-oceano-100 px-2.5 py-0.5 text-xs font-semibold text-oceano-700"
      >
        RM {integrante.rm}
      </p>
      <p className="text-sm text-slate-500">Turma {integrante.turma}</p>
      <div className="mt-auto flex gap-4 pt-4">
        <a
          href={integrante.github}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-oceano-700 hover:underline"
        >
          <FiGithub aria-hidden="true" /> GitHub
        </a>
        <a
          href={integrante.linkedin}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-oceano-700 hover:underline"
        >
          <FiLinkedin aria-hidden="true" /> LinkedIn
        </a>
      </div>
    </Card>
  );
}
