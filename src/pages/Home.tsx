import { Link } from "react-router";
import AnelDecor from "../components/ui/AnelDecor";
import Button from "../components/ui/Button";
import { Carregando, ErroCarregar } from "../components/ui/Estado";
import IconeRecurso from "../components/ui/IconeRecurso";
import Regua from "../components/ui/Regua";
import { useReferencia } from "../context/useReferencia";
import { acentoDe, estiloDoRecurso } from "../data/icones";
import { classesNivel, rotuloNivel, rotuloUnidade } from "../data/rotulos";
import { useApi } from "../hooks/useApi";
import {
  buscarLocal,
  listarMetas,
  listarRegistros,
} from "../services/ecoloopService";
import { mesPadrao, resumirMes } from "../utils/calculos";
import {
  formatarMes,
  formatarMoeda,
  formatarNumero,
} from "../utils/formatacao";

// Local usado no exemplo da capa: Padaria Pão Quente (id 5 nos dados do script SQL).
// Se ele não existir na API, a capa simplesmente não mostra o exemplo.
const LOCAL_EXEMPLO_ID = "5";

const passos = [
  {
    titulo: "Cadastre o local",
    texto:
      "Casa, comunidade ou negócio, com bairro, cidade e o número de pessoas.",
  },
  {
    titulo: "Registre o desperdício",
    texto:
      "Recurso, quantidade, causa e data de cada ocorrência, em poucos campos.",
  },
  {
    titulo: "Defina uma meta mensal",
    texto:
      "Um teto por recurso. A régua mostra quanto do limite já foi usado no mês.",
  },
  {
    titulo: "Aplique as dicas",
    texto:
      "O painel sugere ações para os recursos em que o local mais desperdiça.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-oceano-100 bg-gradient-to-br from-brand-50 via-white to-oceano-100">
        <AnelDecor className="pointer-events-none absolute -left-28 -top-32 h-96 w-96 text-brand-100" />
        <AnelDecor className="pointer-events-none absolute -bottom-40 -right-24 h-[30rem] w-[30rem] text-oceano-200/60" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-brand-950 sm:text-5xl lg:text-6xl">
              Quanto sua casa ou seu negócio{" "}
              <span className="text-oceano-600">desperdiça</span> por mês?
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Registre o desperdício de água, energia e alimentos, compare com
              uma meta mensal e veja quanto isso custa e quanto CO₂ representa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/locais">Ver locais</Button>
              <Button to="/registrar" variante="secundario">
                Registrar desperdício
              </Button>
            </div>
          </div>
          <ExemploAoVivo />
        </div>
      </section>

      <SecaoRecursos />

      <section
        className="border-y border-oceano-100 bg-oceano-50/70"
        aria-labelledby="titulo-passos"
      >
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="titulo-passos" className="text-3xl font-bold text-brand-950">
            Como funciona
          </h2>
          <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {passos.map((passo, indice) => {
              const acento = acentoDe(indice);
              return (
                <li key={passo.titulo}>
                  <span
                    aria-hidden="true"
                    className={`grid h-12 w-12 place-items-center rounded-full font-display text-xl font-extrabold ${acento.fundo} ${acento.texto}`}
                  >
                    {indice + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-brand-950">
                    {passo.titulo}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {passo.texto}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-lg bg-gradient-to-r from-brand-800 via-brand-900 to-oceano-800 px-6 py-10 sm:px-10">
          <AnelDecor className="pointer-events-none absolute -right-12 -top-20 h-72 w-72 text-white/10" />
          <div className="relative max-w-xl">
            <h2 className="text-3xl font-bold text-white">
              Comece pelo seu local
            </h2>
            <p className="mt-2 text-oceano-100">
              Cadastre sua casa, comunidade ou negócio e faça o primeiro
              registro em poucos minutos.
            </p>
          </div>
          <Link
            to="/locais#novo-local"
            className="relative inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-bold text-brand-900 hover:bg-oceano-50"
          >
            Cadastrar local
          </Link>
        </div>
      </section>
    </>
  );
}

/** Painel de verdade, com dados da API, para mostrar o produto logo na capa. */
function ExemploAoVivo() {
  const { recursos, erro: erroReferencia } = useReferencia();
  const { dados, erro } = useApi(async () => {
    const [local, registros, metas] = await Promise.all([
      buscarLocal(LOCAL_EXEMPLO_ID),
      listarRegistros(LOCAL_EXEMPLO_ID),
      listarMetas(LOCAL_EXEMPLO_ID),
    ]);
    return { local, registros, metas };
  }, "home-exemplo");

  if ((erro && !dados) || erroReferencia) return null;
  if (!dados || recursos.length === 0) {
    return (
      <div
        aria-hidden="true"
        className="h-72 animate-pulse rounded-lg bg-slate-100 motion-reduce:animate-none"
      />
    );
  }

  const mes = mesPadrao(dados.registros);
  const linhas = resumirMes(recursos, dados.registros, dados.metas, mes).filter(
    (item) => item.meta,
  );
  if (linhas.length === 0) return null;

  return (
    <div className="rounded-lg border border-linha bg-white">
      <div className="rounded-t-lg border-b border-linha bg-gradient-to-r from-brand-50 to-oceano-50 px-5 py-4">
        <p className="text-sm text-slate-500">Exemplo com dados do sistema</p>
        <h2 className="text-xl font-bold text-brand-950">{dados.local.nome}</h2>
        <p className="text-sm text-slate-500">{formatarMes(mes)}</p>
      </div>

      <ul className="divide-y divide-linha px-5">
        {linhas.map((item) => {
          const unidade = rotuloUnidade[item.recurso.unidade];
          const meta = item.meta?.metaMensal ?? null;
          return (
            <li key={item.recurso.id} className="py-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 font-semibold text-brand-950">
                  <IconeRecurso unidade={item.recurso.unidade} tamanho="sm" />
                  {item.recurso.nome}
                </span>
                <span className="font-display text-lg font-bold tabular-nums text-brand-950">
                  {formatarNumero(item.total)}{" "}
                  <span className="text-sm font-medium text-slate-500">
                    {unidade}
                  </span>
                </span>
              </div>
              <Regua
                total={item.total}
                meta={meta}
                corClasse={estiloDoRecurso(item.recurso.unidade).barra}
                descricao={`${item.recurso.nome}: ${formatarNumero(item.total)} ${unidade} de ${formatarNumero(meta ?? 0)} ${unidade}`}
                rotuloMeta={
                  meta ? `meta ${formatarNumero(meta)} ${unidade}` : undefined
                }
              />
              <p className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 font-semibold ring-1 ring-inset ${classesNivel[item.nivel]}`}
                >
                  {rotuloNivel[item.nivel]}
                </span>
                {item.pctMeta !== null && (
                  <span className="font-semibold tabular-nums text-slate-600">
                    {formatarNumero(item.pctMeta, 1)}% da meta
                  </span>
                )}
              </p>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-linha px-5 py-3">
        <Link
          to={`/locais/${dados.local.id}`}
          className="text-sm font-semibold text-oceano-700 hover:underline"
        >
          Abrir o painel completo
        </Link>
      </div>
    </div>
  );
}

/** Os recursos monitorados, com os valores de referência vindos da API (GET /recursos). */
function SecaoRecursos() {
  const { recursos, carregando, erro, recarregar } = useReferencia();
  return (
    <section
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6"
      aria-labelledby="titulo-recursos"
    >
      <h2 id="titulo-recursos" className="text-3xl font-bold text-brand-950">
        Três recursos, uma unidade para cada um
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
        Cada desperdício é medido na unidade do recurso e convertido em custo e
        CO₂ estimados, com valores de referência.
      </p>

      {erro && (
        <div className="mt-8">
          <ErroCarregar mensagem={erro} onTentarNovamente={recarregar} />
        </div>
      )}
      {carregando && <Carregando texto="Carregando recursos..." />}

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {recursos.map((recurso) => {
          const unidade = rotuloUnidade[recurso.unidade];
          return (
            <li
              key={recurso.id}
              className="overflow-hidden rounded-lg border border-linha bg-white p-5"
            >
              <div
                aria-hidden="true"
                className={`-mx-5 -mt-5 mb-5 h-1.5 ${estiloDoRecurso(recurso.unidade).barra}`}
              />
              <div className="flex items-center gap-3">
                <IconeRecurso unidade={recurso.unidade} tamanho="lg" />
                <div>
                  <h3 className="font-display text-xl font-bold text-brand-950">
                    {recurso.nome}
                  </h3>
                  <p className="text-sm text-slate-500">Medido em {unidade}</p>
                </div>
              </div>
              <dl className="mt-5 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Custo por {unidade}</dt>
                  <dd className="font-semibold tabular-nums text-brand-950">
                    {formatarMoeda(recurso.custoUnitario)}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">CO₂ por {unidade}</dt>
                  <dd className="font-semibold tabular-nums text-brand-950">
                    {formatarNumero(recurso.fatorCo2, 4)} kg
                  </dd>
                </div>
              </dl>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
