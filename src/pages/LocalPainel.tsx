import { useMemo, useState } from "react";
import { FiCalendar, FiEdit2, FiMapPin, FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import ContaDoMes from "../components/locais/ContaDoMes";
import FormLocal from "../components/locais/FormLocal";
import FormMeta from "../components/metas/FormMeta";
import FormRegistro from "../components/registros/FormRegistro";
import ListaRegistros from "../components/registros/ListaRegistros";
import Aviso from "../components/ui/Aviso";
import Button from "../components/ui/Button";
import { Carregando, ErroCarregar, Vazio } from "../components/ui/Estado";
import IconeRecurso from "../components/ui/IconeRecurso";
import Modal from "../components/ui/Modal";
import ModalConfirmar from "../components/ui/ModalConfirmar";
import PageHero from "../components/ui/PageHero";
import { useReferencia } from "../context/useReferencia";
import { iconeTipo } from "../data/icones";
import { rotuloPessoas, rotuloTipo, rotuloUnidade } from "../data/rotulos";
import { useApi } from "../hooks/useApi";
import { buscarLocal, excluirLocal, excluirRegistro, listarMetas, listarRegistros } from "../services/ecoloopService";
import type { Meta, Recurso, Registro } from "../types";
import { causasFrequentes, listarMeses, mesPadrao, ordenarRegistros, resumirMes } from "../utils/calculos";
import { formatarData, formatarMes, formatarNumero } from "../utils/formatacao";

// Listas vazias com identidade fixa, para os useMemo abaixo não recalcularem à toa.
const SEM_REGISTROS: Registro[] = [];
const SEM_METAS: Meta[] = [];

interface AvisoPainel {
  tipo: "sucesso" | "erro";
  texto: string;
}

/** /locais/:id: painel do local (rota com parâmetro). */
export default function LocalPainel() {
  const { id = "" } = useParams();
  // O `key` zera mês escolhido e janelas abertas quando o usuário troca de local.
  return <PainelDoLocal key={id} id={id} />;
}

function PainelDoLocal({ id }: { id: string }) {
  const navigate = useNavigate();
  const referencia = useReferencia();
  const { dados, erro, status, carregando, recarregar, definir } = useApi(async () => {
    const [local, registros, metas] = await Promise.all([buscarLocal(id), listarRegistros(id), listarMetas(id)]);
    return { local, registros, metas };
  }, `painel:${id}`);

  const [mesEscolhido, setMesEscolhido] = useState<string | null>(null);
  const [aviso, setAviso] = useState<AvisoPainel | null>(null);
  const [editandoLocal, setEditandoLocal] = useState(false);
  const [excluindoLocal, setExcluindoLocal] = useState(false);
  const [registroEditando, setRegistroEditando] = useState<Registro | null>(null);
  const [registroExcluindo, setRegistroExcluindo] = useState<Registro | null>(null);
  const [metaEditando, setMetaEditando] = useState<{ recurso: Recurso; meta: Meta | null } | null>(null);

  const registros = dados?.registros ?? SEM_REGISTROS;
  const metas = dados?.metas ?? SEM_METAS;
  const { recursos, causas, dicas, recursoPorId } = referencia;

  const mesInicial = useMemo(() => mesPadrao(registros), [registros]);
  const mes = mesEscolhido ?? mesInicial;
  const opcoesMeses = useMemo(() => {
    const lista = listarMeses(registros);
    return lista.includes(mes) ? lista : [mes, ...lista].sort().reverse();
  }, [registros, mes]);
  const resumo = useMemo(() => resumirMes(recursos, registros, metas, mes), [recursos, registros, metas, mes]);
  const ordenados = useMemo(() => ordenarRegistros(registros), [registros]);
  const causasDoMes = useMemo(
    () => causasFrequentes(registros, causas, recursos, mes).slice(0, 3),
    [registros, causas, recursos, mes],
  );

  if (status === 404) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Vazio titulo="Local não encontrado">
          <p>Ele pode ter sido excluído ou o endereço está incorreto.</p>
          <Button to="/locais" className="mt-4">
            Voltar para os locais
          </Button>
        </Vazio>
      </div>
    );
  }
  if (erro && !dados) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ErroCarregar mensagem={erro} onTentarNovamente={recarregar} />
      </div>
    );
  }
  if (referencia.erro) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <ErroCarregar mensagem={referencia.erro} onTentarNovamente={referencia.recarregar} />
      </div>
    );
  }
  if (carregando || referencia.carregando || !dados) return <Carregando texto="Carregando painel..." />;

  const { local } = dados;
  const IconeTipo = iconeTipo[local.tipo];

  // Alimento por pessoa no mês (consulta 09 do SQL).
  const alimento = resumo.find((item) => item.recurso.unidade === "KG");
  const alimentoPorPessoa = alimento && local.qtPessoas > 0 ? alimento.total / local.qtPessoas : null;

  // Dicas dos recursos em que o local já registrou desperdício (consulta 10); sem histórico, as de maior economia.
  const recursosComRegistro = new Set(registros.map((r) => r.recursoId));
  const dicasDoLocal = [...(recursosComRegistro.size > 0 ? dicas.filter((d) => recursosComRegistro.has(d.recursoId)) : dicas)]
    .sort((a, b) => b.economiaPct - a.economiaPct)
    .slice(0, 6);

  return (
    <>
      <PageHero
        titulo={local.nome}
        voltarPara={{ to: "/locais", rotulo: "Todos os locais" }}
        acoes={
          <>
            <Button to={`/registrar?local=${local.id}`}>
              <FiPlus aria-hidden="true" /> Registrar desperdício
            </Button>
            <Button variante="secundario" onClick={() => setEditandoLocal(true)}>
              <FiEdit2 aria-hidden="true" /> Editar local
            </Button>
            <Button variante="texto" className="text-alerta hover:bg-alerta-fraco" onClick={() => setExcluindoLocal(true)}>
              <FiTrash2 aria-hidden="true" /> Excluir local
            </Button>
          </>
        }
      >
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <li className="inline-flex items-center gap-1.5 font-semibold text-brand-800">
            <IconeTipo aria-hidden="true" /> {rotuloTipo[local.tipo]}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <FiMapPin aria-hidden="true" /> {local.bairro}, {local.cidade}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <FiUsers aria-hidden="true" /> {local.qtPessoas} {rotuloPessoas[local.tipo]}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <FiCalendar aria-hidden="true" /> Cadastrado em {formatarData(local.dataCadastro)}
          </li>
        </ul>
      </PageHero>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        {aviso && (
          <Aviso tipo={aviso.tipo} onFechar={() => setAviso(null)}>
            {aviso.texto}
          </Aviso>
        )}

        <ContaDoMes
          resumo={resumo}
          mes={mes}
          meses={opcoesMeses}
          onMudarMes={setMesEscolhido}
          onAjustarMeta={(recurso, meta) => setMetaEditando({ recurso, meta })}
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
          <section aria-labelledby="titulo-registros">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h2 id="titulo-registros" className="text-xl font-bold text-brand-950">
                Últimos registros
              </h2>
              <Button to={`/registrar?local=${local.id}`} variante="secundario" tamanho="sm">
                <FiPlus aria-hidden="true" /> Novo registro
              </Button>
            </div>

            {ordenados.length === 0 ? (
              <Vazio titulo="Nenhum registro ainda">
                <p>Registre o primeiro desperdício deste local para ver os totais do mês e receber dicas.</p>
                <Button to={`/registrar?local=${local.id}`} className="mt-4">
                  Registrar desperdício
                </Button>
              </Vazio>
            ) : (
              <ListaRegistros registros={ordenados} onEditar={setRegistroEditando} onExcluir={setRegistroExcluindo} />
            )}
          </section>

          <aside className="space-y-8">
            <section aria-labelledby="titulo-causas">
              <h2 id="titulo-causas" className="text-xl font-bold text-brand-950">
                Causas mais frequentes
              </h2>
              <p className="mb-3 text-sm text-slate-500">Em {formatarMes(mes)}</p>
              {causasDoMes.length === 0 ? (
                <p className="rounded-lg border border-dashed border-linha-forte bg-white px-4 py-5 text-sm text-slate-600">
                  Sem registros neste mês.
                </p>
              ) : (
                <ol className="divide-y divide-linha rounded-lg border border-linha bg-white px-4">
                  {causasDoMes.map((item) => (
                    <li key={item.causa.id} className="flex items-start gap-3 py-3">
                      {item.recurso && <IconeRecurso unidade={item.recurso.unidade} tamanho="sm" />}
                      <div>
                        <p className="text-sm font-semibold leading-snug text-brand-950">{item.causa.nome}</p>
                        <p className="text-xs text-slate-500">
                          {item.ocorrencias} {item.ocorrencias === 1 ? "registro" : "registros"}, {formatarNumero(item.total)}{" "}
                          {item.recurso ? rotuloUnidade[item.recurso.unidade] : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </section>

            {alimentoPorPessoa !== null && alimento && (
              <section aria-labelledby="titulo-por-pessoa">
                <h2 id="titulo-por-pessoa" className="text-xl font-bold text-brand-950">
                  Alimento por pessoa
                </h2>
                <p className="mt-2 font-display text-3xl font-bold tabular-nums text-brand-950">
                  {formatarNumero(alimentoPorPessoa)} <span className="text-base font-medium text-slate-500">kg</span>
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {formatarNumero(alimento.total)} kg divididos por {local.qtPessoas} {rotuloPessoas[local.tipo]}, em{" "}
                  {formatarMes(mes)}.
                </p>
              </section>
            )}
          </aside>
        </div>

        <section aria-labelledby="titulo-dicas">
          <h2 id="titulo-dicas" className="text-xl font-bold text-brand-950">
            Dicas para reduzir o desperdício
          </h2>
          <p className="mb-4 mt-1 max-w-2xl text-sm text-slate-600">
            {recursosComRegistro.size > 0
              ? `Sugestões para os recursos em que ${local.nome} já registrou desperdício.`
              : "Este local ainda não tem registros. Estas são as dicas com maior economia estimada para começar."}{" "}
            Os percentuais são estimativas ilustrativas.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dicasDoLocal.map((dica) => {
              const recurso = recursoPorId(dica.recursoId);
              return (
                <li key={dica.id} className="rounded-lg border border-linha bg-white p-5">
                  <div className="flex items-start gap-3">
                    {recurso && <IconeRecurso unidade={recurso.unidade} tamanho="sm" />}
                    <div>
                      <h3 className="font-display text-base font-semibold leading-snug text-brand-950">{dica.titulo}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-600">{dica.descricao}</p>
                      <p className="mt-3 inline-flex rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-800 ring-1 ring-inset ring-brand-200">
                        Economia estimada de {formatarNumero(dica.economiaPct, 0)}%
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      <Modal aberto={editandoLocal} titulo="Editar local" onFechar={() => setEditandoLocal(false)}>
        <FormLocal
          local={local}
          cidadesSugeridas={[local.cidade]}
          onSalvo={(atualizado) => {
            definir({ ...dados, local: atualizado });
            setEditandoLocal(false);
            setAviso({ tipo: "sucesso", texto: "Local atualizado." });
          }}
          onCancelar={() => setEditandoLocal(false)}
        />
      </Modal>

      <Modal
        aberto={Boolean(registroEditando)}
        titulo="Editar registro"
        largura="lg"
        onFechar={() => setRegistroEditando(null)}
      >
        {registroEditando && (
          <FormRegistro
            locais={[local]}
            registro={registroEditando}
            onSalvo={() => {
              recarregar();
              setRegistroEditando(null);
              setAviso({ tipo: "sucesso", texto: "Registro atualizado." });
            }}
            onCancelar={() => setRegistroEditando(null)}
          />
        )}
      </Modal>

      <Modal
        aberto={Boolean(metaEditando)}
        titulo={metaEditando ? `Meta de ${metaEditando.recurso.nome.toLowerCase()}` : "Meta"}
        onFechar={() => setMetaEditando(null)}
      >
        {metaEditando && (
          <FormMeta
            localId={local.id}
            recurso={metaEditando.recurso}
            meta={metaEditando.meta}
            onSalvo={() => {
              recarregar();
              setMetaEditando(null);
              setAviso({ tipo: "sucesso", texto: "Meta salva." });
            }}
            onRemovido={() => {
              recarregar();
              setMetaEditando(null);
              setAviso({ tipo: "sucesso", texto: "Meta removida." });
            }}
            onCancelar={() => setMetaEditando(null)}
          />
        )}
      </Modal>

      {registroExcluindo && (
        <ModalConfirmar
          titulo="Excluir registro?"
          rotuloConfirmar="Excluir registro"
          onFechar={() => setRegistroExcluindo(null)}
          onConfirmar={async () => {
            await excluirRegistro(registroExcluindo.id);
            definir({ ...dados, registros: registros.filter((r) => r.id !== registroExcluindo.id) });
            setRegistroExcluindo(null);
            setAviso({ tipo: "sucesso", texto: "Registro excluído." });
          }}
        >
          <p>
            Você vai apagar o registro de <strong>{formatarData(registroExcluindo.data)}</strong>
            {(() => {
              const recurso = recursoPorId(registroExcluindo.recursoId);
              return recurso
                ? ` (${formatarNumero(registroExcluindo.quantidade)} ${rotuloUnidade[recurso.unidade]} de ${recurso.nome.toLowerCase()})`
                : "";
            })()}
            .
          </p>
          <p>Essa ação não pode ser desfeita.</p>
        </ModalConfirmar>
      )}

      {excluindoLocal && (
        <ModalConfirmar
          titulo="Excluir local?"
          rotuloConfirmar="Excluir local"
          onFechar={() => setExcluindoLocal(false)}
          onConfirmar={async () => {
            await excluirLocal(local.id);
            navigate("/locais", { state: { aviso: `${local.nome} foi excluído.` } });
          }}
        >
          <p>
            Você vai excluir <strong>{local.nome}</strong> e as metas dele.
          </p>
          <p>Só é possível excluir locais que não têm registros de desperdício.</p>
        </ModalConfirmar>
      )}
    </>
  );
}
