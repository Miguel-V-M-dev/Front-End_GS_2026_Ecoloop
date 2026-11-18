import { useState } from "react";
import type { ChangeEvent, ComponentProps, KeyboardEvent, ReactNode } from "react";
import { formatarData } from "../../utils/formatacao";
import { classesCampo } from "../../utils/estilos";

interface CampoBase {
  id: string;
  rotulo: string;
  erro?: string;
  dica?: string;
}

function Moldura({ id, rotulo, erro, dica, children }: CampoBase & { children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-tinta">
        {rotulo}
      </label>
      {children}
      {erro ? (
        <p id={`${id}-erro`} role="alert" className="mt-1 text-xs font-medium text-alerta">
          {erro}
        </p>
      ) : dica ? (
        <p id={`${id}-dica`} className="mt-1 text-xs text-slate-500">
          {dica}
        </p>
      ) : null}
    </div>
  );
}

function descricaoDe({ id, erro, dica }: CampoBase): string | undefined {
  if (erro) return `${id}-erro`;
  return dica ? `${id}-dica` : undefined;
}

// Os campos aceitam as props do elemento nativo, inclusive o `{...register("campo")}`
// do react-hook-form (no React 19 o `ref` chega como prop comum).

export function CampoTexto({ id, rotulo, erro, dica, ...rest }: CampoBase & ComponentProps<"input">) {
  return (
    <Moldura id={id} rotulo={rotulo} erro={erro} dica={dica}>
      <input
        {...rest}
        id={id}
        aria-invalid={Boolean(erro)}
        aria-describedby={descricaoDe({ id, rotulo, erro, dica })}
        className={classesCampo(Boolean(erro))}
      />
    </Moldura>
  );
}

export function CampoSelect({ id, rotulo, erro, dica, children, ...rest }: CampoBase & ComponentProps<"select">) {
  return (
    <Moldura id={id} rotulo={rotulo} erro={erro} dica={dica}>
      <select
        {...rest}
        id={id}
        aria-invalid={Boolean(erro)}
        aria-describedby={descricaoDe({ id, rotulo, erro, dica })}
        className={classesCampo(Boolean(erro))}
      >
        {children}
      </select>
    </Moldura>
  );
}

export function CampoTextarea({ id, rotulo, erro, dica, ...rest }: CampoBase & ComponentProps<"textarea">) {
  return (
    <Moldura id={id} rotulo={rotulo} erro={erro} dica={dica}>
      <textarea
        {...rest}
        id={id}
        aria-invalid={Boolean(erro)}
        aria-describedby={descricaoDe({ id, rotulo, erro, dica })}
        className={classesCampo(Boolean(erro))}
      />
    </Moldura>
  );
}

const semAcento = (texto: string) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

type CampoSugestoesProps = CampoBase & Omit<ComponentProps<"input">, "id" | "value" | "list"> & {
  /** Texto digitado agora (use `useWatch`). */
  valor: string;
  sugestoes: string[];
  /** Chamado ao escolher uma sugestão (use `setValue`). */
  onEscolher: (valor: string) => void;
};

/**
 * Campo de texto com lista de sugestões logo abaixo do campo.
 * Substitui o <datalist> nativo, cuja lista abre em posição errada em alguns navegadores.
 */
export function CampoSugestoes({
  id,
  rotulo,
  erro,
  dica,
  valor,
  sugestoes,
  onEscolher,
  onChange,
  onBlur,
  onFocus,
  onKeyDown,
  ...rest
}: CampoSugestoesProps) {
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(-1);

  const busca = semAcento(valor.trim());
  const filtradas = sugestoes.filter((s) => semAcento(s).includes(busca) && semAcento(s) !== busca);
  const mostrar = aberto && filtradas.length > 0;

  function escolher(sugestao: string) {
    onEscolher(sugestao);
    setAberto(false);
    setAtivo(-1);
  }

  function aoTeclar(e: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(e);
    if (e.key === "Escape") {
      setAberto(false);
    } else if (e.key === "ArrowDown" && filtradas.length > 0) {
      e.preventDefault();
      setAberto(true);
      setAtivo((i) => (i + 1) % filtradas.length);
    } else if (e.key === "ArrowUp" && mostrar) {
      e.preventDefault();
      setAtivo((i) => (i <= 0 ? filtradas.length - 1 : i - 1));
    } else if (e.key === "Enter" && mostrar && ativo >= 0) {
      e.preventDefault();
      escolher(filtradas[ativo]);
    }
  }

  return (
    <Moldura id={id} rotulo={rotulo} erro={erro} dica={dica}>
      <div className="relative">
        <input
          {...rest}
          id={id}
          role="combobox"
          aria-expanded={mostrar}
          aria-controls={`${id}-lista`}
          aria-autocomplete="list"
          aria-activedescendant={mostrar && ativo >= 0 ? `${id}-opcao-${ativo}` : undefined}
          aria-invalid={Boolean(erro)}
          aria-describedby={descricaoDe({ id, rotulo, erro, dica })}
          autoComplete="off"
          className={classesCampo(Boolean(erro))}
          onFocus={(e) => {
            onFocus?.(e);
            setAberto(true);
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            setAberto(true);
            setAtivo(-1);
          }}
          onBlur={(e) => {
            onBlur?.(e);
            setAberto(false);
          }}
          onKeyDown={aoTeclar}
        />
        {mostrar && (
          <ul
            id={`${id}-lista`}
            role="listbox"
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-48 overflow-auto rounded-md border border-linha bg-white py-1 shadow-lg"
          >
            {filtradas.map((sugestao, i) => (
              <li
                key={sugestao}
                id={`${id}-opcao-${i}`}
                role="option"
                aria-selected={i === ativo}
                // mousedown (e não click) para escolher antes de o campo perder o foco
                onMouseDown={(e) => {
                  e.preventDefault();
                  escolher(sugestao);
                }}
                className={`cursor-pointer px-3 py-2 text-sm text-tinta ${i === ativo ? "bg-oceano-100" : "hover:bg-oceano-50"}`}
              >
                {sugestao}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Moldura>
  );
}

interface CampoDataProps extends CampoBase {
  /** Valor do formulário: data ISO (aaaa-mm-dd) ou o texto ainda incompleto. */
  valor: string;
  /** Recebe a data ISO quando o texto está completo e válido; senão, o texto digitado. */
  onChange: (valor: string) => void;
  onBlur?: () => void;
  name?: string;
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** "13112026" -> "13/11/2026" (aceita digitação parcial). */
function mascararData(texto: string): string {
  const d = texto.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** "13/11/2026" -> "2026-11-13"; devolve null se não for uma data real do calendário. */
function paraISO(texto: string): string | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!m) return null;
  const [, dia, mes, ano] = m;
  const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
  const real = data.getFullYear() === Number(ano) && data.getMonth() === Number(mes) - 1 && data.getDate() === Number(dia);
  return real ? `${ano}-${mes}-${dia}` : null;
}

/**
 * Campo de data sempre no formato dd/mm/aaaa (o <input type="date"> segue o idioma do navegador,
 * e em navegadores em inglês aparece mm/dd/aaaa). O formulário continua guardando aaaa-mm-dd.
 */
export function CampoData({ id, rotulo, erro, dica, valor, onChange, onBlur, name }: CampoDataProps) {
  return (
    <Moldura id={id} rotulo={rotulo} erro={erro} dica={dica}>
      <input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder="dd/mm/aaaa"
        maxLength={10}
        value={ISO.test(valor) ? formatarData(valor) : valor}
        onChange={(e) => {
          const texto = mascararData(e.target.value);
          onChange(paraISO(texto) ?? texto);
        }}
        onBlur={onBlur}
        aria-invalid={Boolean(erro)}
        aria-describedby={descricaoDe({ id, rotulo, erro, dica })}
        className={classesCampo(Boolean(erro))}
      />
    </Moldura>
  );
}
