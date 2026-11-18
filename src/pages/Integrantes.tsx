import PageHero from "../components/ui/PageHero";
import TeamCard from "../components/ui/TeamCard";
import { integrantes } from "../data/team";

export default function Integrantes() {
  return (
    <>
      <PageHero titulo="Integrantes">
        <p>A equipe Ecoloop, da turma 1-TDSPI da FIAP, que criou o Desperdício Zero.</p>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrantes.map((integrante) => (
            <li key={integrante.id} className="flex">
              <TeamCard integrante={integrante} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
