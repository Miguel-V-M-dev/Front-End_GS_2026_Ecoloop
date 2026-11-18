import { useEffect, useMemo, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router";
import FormLocal from "../components/locais/FormLocal";
import LocalCard from "../components/locais/LocalCard";
import Aviso from "../components/ui/Aviso";
import Button from "../components/ui/Button";
import { Carregando, ErroCarregar, Vazio } from "../components/ui/Estado";
import Modal from "../components/ui/Modal";
import PageHero from "../components/ui/PageHero";
import { TIPOS_LOCAL, rotuloTipoPlural } from "../data/rotulos";
import { useApi } from "../hooks/useApi";
import { listarLocais } from "../services/ecoloopService";
import type { Local, TipoLocal } from "../types";
import { classesCampo } from "../utils/estilos";
import { compararNomes, normalizarBusca } from "../utils/ordenacao";

interface EstadoDaRota {
  aviso?: string;
}

/** /locais: lista de locais (GET) e janela (modal) para cadastrar um novo (POST). */
export default function Locais() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dados: locais, erro, carregando, recarregar, definir } = useApi(listarLocais, "locais");

  const [busca, setBusca] = useState("");
  const [tipo, setTipo] = useState<TipoLocal | "TODOS">("TODOS");
  const [aviso, setAviso] = useState(() => (location.state as EstadoDaRota | null)?.aviso ?? "");
  const [criado, setCriado] = useState<Local | null>(null);
  // Links como /locais#novo-local (Início e Registrar) já abrem a janela de cadastro.
  const [cadastrando, setCadastrando] = useState(() => location.hash === "#novo-local");

  useEffect(() => {
    if (location.hash === "#novo-local") {
      navigate(location.pathname, { replace: true, state: location.state });
    }
  }, [location.hash, location.pathname, location.state, navigate]);

  // O aviso pode chegar pela navegação (ex.: local excluído no painel). Depois de lido,
  // limpa o estado da rota para ele não reaparecer ao recarregar a página.
  useEffect(() => {
    if ((location.state as EstadoDaRota | null)?.aviso) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

  const cidades = useMemo(() => [...new Set((locais ?? []).map((l) => l.cidade))].sort(compararNomes), [locais]);

  const filtrados = useMemo(() => {
    const termo = normalizarBusca(busca);
    return (locais ?? [])
      .filter((l) => tipo === "TODOS" || l.tipo === tipo)
      .filter((l) => !termo || normalizarBusca(`${l.nome} ${l.bairro}`).includes(termo))
      .sort((a, b) => compararNomes(a.nome, b.nome));
  }, [locais, busca, tipo]);

  const opcoesTipo = [
    { valor: "TODOS" as const, rotulo: "Todos", total: locais?.length ?? 0 },
    ...TIPOS_LOCAL.map((t) => ({
      valor: t,
      rotulo: rotuloTipoPlural[t],
      total: (locais ?? []).filter((l) => l.tipo === t).length,
    })),
  ];

  return (
    <>
      <PageHero titulo="Locais" acoes={<Button onClick={() => setCadastrando(true)}>Cadastrar novo local</Button>}>
        <p>Casas, comunidades e negócios que registram o que desperdiçam. Abra um local para ver o painel do mês.</p>
      </PageHero>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <section aria-labelledby="titulo-lista">
          <h2 id="titulo-lista" className="sr-only">
            Lista de locais
          </h2>

          {aviso && (
            <Aviso tipo="sucesso" onFechar={() => setAviso("")} className="mb-5">
              {aviso}
            </Aviso>
          )}

          {carregando && <Carregando texto="Carregando locais..." />}
          {erro && !locais && <ErroCarregar mensagem={erro} onTentarNovamente={recarregar} />}

          {locais && (
            <>
              <div className="mb-5 flex flex-wrap items-end gap-4">
                <div className="min-w-56 flex-1">
                  <label htmlFor="busca" className="mb-1 block text-sm font-semibold text-tinta">
                    Buscar por nome ou bairro
                  </label>
                  <div className="relative">
                    <FiSearch aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="busca"
                      type="search"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Ex.: padaria"
                      className={`${classesCampo(false)} pl-9`}
                    />
                  </div>
                </div>

                <div role="group" aria-label="Filtrar por tipo" className="flex flex-wrap gap-2">
                  {opcoesTipo.map((opcao) => (
                    <button
                      key={opcao.valor}
                      type="button"
                      aria-pressed={tipo === opcao.valor}
                      onClick={() => setTipo(opcao.valor)}
                      className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                        tipo === opcao.valor
                          ? "border-oceano-700 bg-oceano-700 text-white"
                          : "border-linha-forte bg-white text-slate-700 hover:border-oceano-400"
                      }`}
                    >
                      {opcao.rotulo} <span className="text-xs tabular-nums opacity-75">{opcao.total}</span>
                    </button>
                  ))}
                </div>
              </div>

              <p className="mb-4 text-sm text-slate-600" aria-live="polite">
                {filtrados.length} de {locais.length} {locais.length === 1 ? "local" : "locais"}
              </p>

              {filtrados.length === 0 ? (
                <Vazio titulo={locais.length === 0 ? "Nenhum local cadastrado" : "Nenhum local encontrado"}>
                  <p>
                    {locais.length === 0
                      ? "Use o botão \"Cadastrar novo local\" para cadastrar o primeiro."
                      : "Tente outro nome ou limpe o filtro de tipo."}
                  </p>
                </Vazio>
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtrados.map((local) => (
                    <li key={local.id}>
                      <LocalCard local={local} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

      </div>

      <Modal aberto={cadastrando} titulo="Cadastrar novo local" onFechar={() => setCadastrando(false)}>
        <p className="mb-5 text-sm text-slate-600">
          Depois de cadastrar, registre o desperdício e defina metas no painel do local.
        </p>
        <FormLocal
          cidadesSugeridas={cidades}
          onSalvo={(novo) => {
            if (locais) definir([...locais, novo]);
            setCadastrando(false);
            setCriado(novo);
          }}
          onCancelar={() => setCadastrando(false)}
        />
      </Modal>

      <Modal aberto={Boolean(criado)} titulo="Local cadastrado!" onFechar={() => setCriado(null)}>
        {criado && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed">
              <strong>{criado.nome}</strong> já está na lista. Que tal fazer o primeiro registro de desperdício?
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <Button variante="secundario" onClick={() => setCriado(null)}>
                Cadastrar outro
              </Button>
              <Link
                to={`/locais/${criado.id}`}
                className="inline-flex items-center justify-center rounded-md bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
              >
                Abrir painel
              </Link>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
