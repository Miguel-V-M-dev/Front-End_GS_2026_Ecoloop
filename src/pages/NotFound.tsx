import Button from "../components/ui/Button";
import PageHero from "../components/ui/PageHero";

/** Rota "*": endereço que não existe. */
export default function NotFound() {
  return (
    <>
      <PageHero titulo="Página não encontrada">
        <p>O endereço que você abriu não existe ou foi movido.</p>
      </PageHero>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap gap-3">
          <Button to="/">Ir para o início</Button>
          <Button to="/locais" variante="secundario">
            Ver locais
          </Button>
        </div>
      </div>
    </>
  );
}
