import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useReferencia } from "../context/useReferencia";
import FormRegistro from "../components/registros/FormRegistro";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { Carregando, ErroCarregar } from "../components/ui/Estado";
import Modal from "../components/ui/Modal";
import PageHero from "../components/ui/PageHero";
import { rotuloUnidade } from "../data/rotulos";
import { useApi } from "../hooks/useApi";
import { listarLocais } from "../services/ecoloopService";
import type { Registro } from "../types";
import { formatarData, formatarNumero } from "../utils/formatacao";

/** /registrar: formulário de registro de desperdício (POST) com validação e retorno da API. */
export default function Registrar() {
  const [params] = useSearchParams();
  const localIdInicial = params.get("local") ?? undefined;

  const referencia = useReferencia();
  const { dados: locais, erro: erroLocais, carregando: carregandoLocais, recarregar: recarregarLocais } = useApi(
    listarLocais,
    "locais",
  );
  const [salvo, setSalvo] = useState<Registro | null>(null);

  const erro = referencia.erro ?? (locais ? null : erroLocais) ?? null;
  const pronto = !referencia.carregando && !carregandoLocais && locais && referencia.recursos.length > 0;

  const localSalvo = salvo ? locais?.find((l) => l.id === salvo.localId) : undefined;
  const recursoSalvo = salvo ? referencia.recursoPorId(salvo.recursoId) : undefined;

  return (
    <>
      <PageHero titulo="Registrar desperdício">
        <p>
          Anote cada ocorrência com o recurso, a quantidade, a causa e a data. Os registros alimentam o painel do local
          e a comparação com a meta do mês.
        </p>
      </PageHero>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          {erro && (
            <ErroCarregar
              mensagem={erro}
              onTentarNovamente={() => {
                referencia.recarregar();
                recarregarLocais();
              }}
            />
          )}
          {!erro && !pronto && <Carregando texto="Carregando locais e recursos..." />}
          {!erro && pronto && (
            <Card>
              <FormRegistro locais={locais} localIdInicial={localIdInicial} onSalvo={setSalvo} />
            </Card>
          )}
        </div>

        <aside className="h-fit space-y-4 rounded-lg border border-brand-200 bg-brand-50 p-5 text-sm leading-relaxed text-slate-700">
          <h2 className="text-lg font-bold text-brand-800">Para registrar bem</h2>
          <p>Anote logo depois de perceber o desperdício. A data de hoje já vem preenchida.</p>
          <p>Use a unidade do recurso: litros para água, kWh para energia e kg para alimento.</p>
          <p>Escolha a causa mais próxima do que aconteceu. Ela mostra onde agir primeiro.</p>
          <p>
            Ainda não tem um local?{" "}
            <Link to="/locais#novo-local" className="font-semibold text-oceano-700 hover:underline">
              Cadastre aqui
            </Link>
            .
          </p>
        </aside>
      </div>

      <Modal aberto={Boolean(salvo)} titulo="Registro salvo!" onFechar={() => setSalvo(null)}>
        {salvo && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed">
              Registramos{" "}
              <strong>
                {formatarNumero(salvo.quantidade)} {recursoSalvo ? rotuloUnidade[recursoSalvo.unidade] : ""}
              </strong>{" "}
              de {recursoSalvo?.nome.toLowerCase()} em {formatarData(salvo.data)}
              {localSalvo ? ` para ${localSalvo.nome}` : ""}.
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <Button variante="secundario" onClick={() => setSalvo(null)}>
                Registrar outro
              </Button>
              <Link
                to={`/locais/${salvo.localId}`}
                className="inline-flex items-center justify-center rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
              >
                Ver painel do local
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
