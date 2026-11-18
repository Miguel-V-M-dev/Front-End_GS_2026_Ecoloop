// Contrato JSON entre o front e a API. Cada interface corresponde a uma tabela do
// script SQL (gs_database_desperdicio_zero.sql); o comentário indica a coluna original.
//
// Ids são tratados como TEXTO no front: a API Java devolve números e o front compara
// sempre texto (valor de <select>, parâmetros de rota). A conversão é feita em services/api.ts.
// Datas são strings ISO "aaaa-mm-dd" (coluna DATE).

export type Id = string;

// CHECK ck_local_tipo
export type TipoLocal = "CASA" | "COMUNIDADE" | "NEGOCIO";
// CHECK ck_recurso_unid
export type UnidadeRecurso = "L" | "KWH" | "KG";

// ---------- tb_local ----------
export interface Local {
  id: Id; // cd_local
  nome: string; // nm_local VARCHAR2(100)
  tipo: TipoLocal; // ds_tipo
  cidade: string; // nm_cidade VARCHAR2(60)
  bairro: string; // nm_bairro VARCHAR2(60)
  qtPessoas: number; // qt_pessoas NUMBER(6), CHECK > 0 (moradores ou funcionários)
  dataCadastro: string; // dt_cadastro DATE
}

// ---------- tb_recurso (água, energia, alimento) ----------
export interface Recurso {
  id: Id; // cd_recurso
  nome: string; // nm_recurso VARCHAR2(30), UNIQUE
  unidade: UnidadeRecurso; // ds_unidade
  custoUnitario: number; // vl_custo_unitario: R$ por unidade (valor de referência)
  fatorCo2: number; // vl_fator_co2: kg de CO₂ por unidade (valor de referência)
}

// ---------- tb_causa (1:N com recurso) ----------
export interface Causa {
  id: Id; // cd_causa
  recursoId: Id; // cd_recurso (FK)
  nome: string; // nm_causa VARCHAR2(80)
  descricao: string | null; // ds_causa VARCHAR2(200)
}

// ---------- tb_dica (1:N com recurso) ----------
export interface Dica {
  id: Id; // cd_dica
  recursoId: Id; // cd_recurso (FK)
  titulo: string; // nm_titulo VARCHAR2(80)
  descricao: string; // ds_dica VARCHAR2(300)
  economiaPct: number; // vl_economia_pct NUMBER(5,2), 0 a 100 (estimativa ilustrativa)
}

// ---------- tb_registro (1:N com local, recurso e causa) ----------
export interface Registro {
  id: Id; // cd_registro
  localId: Id; // cd_local (FK)
  recursoId: Id; // cd_recurso (FK)
  causaId: Id; // cd_causa (FK composta com cd_recurso: a causa pertence ao recurso)
  quantidade: number; // qt_desperdicio NUMBER(10,2), CHECK > 0 (na unidade do recurso)
  data: string; // dt_registro DATE (não pode ser futura)
  observacao: string | null; // ds_observacao VARCHAR2(200)
}

// ---------- tb_meta (associativa N:N entre local e recurso) ----------
export interface Meta {
  id: Id; // cd_meta
  localId: Id; // cd_local (FK)
  recursoId: Id; // cd_recurso (FK), UNIQUE (cd_local, cd_recurso)
  metaMensal: number; // qt_meta_mensal NUMBER(10,2): teto mensal de desperdício, CHECK > 0
  dataInicio: string; // dt_inicio DATE
}

// ---------- Corpos enviados em POST/PUT (o id é gerado pela API) ----------
export type LocalEntrada = Pick<
  Local,
  "nome" | "tipo" | "cidade" | "bairro" | "qtPessoas"
>;
export type RegistroEntrada = Omit<Registro, "id">;
export type MetaEntrada = Omit<Meta, "id">;

// ---------- Cálculos do painel (utils/calculos.ts) ----------
/** Situação do total do mês em relação à meta mensal. */
export type NivelMeta = "SEM_META" | "DENTRO" | "PERTO" | "ESTOUROU";

export interface ResumoRecurso {
  recurso: Recurso;
  total: number; // soma do mês na unidade do recurso
  qtRegistros: number;
  meta: Meta | null;
  pctMeta: number | null; // total / meta x 100
  nivel: NivelMeta;
  custo: number; // total x custoUnitario (R$)
  co2: number; // total x fatorCo2 (kg)
}

export interface CausaFrequente {
  causa: Causa;
  recurso: Recurso | undefined;
  ocorrencias: number;
  total: number;
}

// ---------- Conteúdo das páginas institucionais ----------
export interface Integrante {
  id: number;
  nome: string;
  rm: string;
  turma: string;
  foto: string;
  github: string;
  linkedin: string;
}

export interface FaqEntrada {
  id: string;
  pergunta: string;
  resposta: string;
}

// ---------- tb_contato (mensagens enviadas pela página Contato) ----------
// CHECK ck_contato_assunto
export type AssuntoContato =
  "DUVIDA" | "SUGESTAO" | "PROBLEMA" | "ELOGIO" | "PARCERIA";
// CHECK ck_contato_status
export type StatusContato = "NOVO" | "LIDO" | "RESPONDIDO";

export interface Contato {
  id: Id; // cd_contato
  nome: string; // nm_contato VARCHAR2(100)
  email: string; // ds_email VARCHAR2(120)
  assunto: AssuntoContato; // ds_assunto
  mensagem: string; // ds_mensagem VARCHAR2(1000)
  dataEnvio: string; // dt_envio DATE (preenchida pela API)
  status: StatusContato; // ds_status (a API grava NOVO)
}

/** Corpo do POST /contatos: id, dataEnvio e status ficam por conta da API. */
export type ContatoEntrada = Pick<
  Contato,
  "nome" | "email" | "assunto" | "mensagem"
>;
