import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { TIPOS_LOCAL, rotuloPessoas, rotuloTipo } from "../../data/rotulos";
import { atualizarLocal, criarLocal } from "../../services/ecoloopService";
import type { Local, TipoLocal } from "../../types";
import Aviso from "../ui/Aviso";
import Button from "../ui/Button";
import { CampoSelect, CampoSugestoes, CampoTexto } from "../ui/Campos";

// Campo numérico vazio vira "indefinido" para cair na mensagem de obrigatório.
const vazioParaIndefinido = (valor: unknown, original: unknown) => (original === "" ? undefined : valor);

// Limites iguais aos da tabela tb_local (VARCHAR2 e NUMBER).
const esquema = yup.object({
  nome: yup
    .string()
    .trim()
    .required("Informe o nome do local.")
    .min(3, "Use pelo menos 3 caracteres.")
    .max(100, "Use no máximo 100 caracteres."),
  tipo: yup.mixed<TipoLocal>().oneOf(TIPOS_LOCAL, "Escolha o tipo do local.").required("Escolha o tipo do local."),
  cidade: yup.string().trim().required("Informe a cidade.").max(60, "Use no máximo 60 caracteres."),
  bairro: yup.string().trim().required("Informe o bairro.").max(60, "Use no máximo 60 caracteres."),
  qtPessoas: yup
    .number()
    .transform(vazioParaIndefinido)
    .typeError("Digite apenas números.")
    .required("Informe a quantidade de pessoas.")
    .integer("Use um número inteiro.")
    .min(1, "Precisa ser maior que zero.")
    .max(999999, "O máximo é 999.999 pessoas."),
});

type Valores = yup.InferType<typeof esquema>;

interface FormLocalProps {
  /** Se informado, o formulário edita este local (PUT); senão cadastra um novo (POST). */
  local?: Local;
  cidadesSugeridas?: string[];
  onSalvo: (local: Local) => void;
  onCancelar?: () => void;
}

/** Formulário de local: usado em /locais (cadastrar) e no painel do local (editar). */
export default function FormLocal({ local, cidadesSugeridas = [], onSalvo, onCancelar }: FormLocalProps) {
  const [erroApi, setErroApi] = useState("");
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Valores>({
    resolver: yupResolver(esquema),
    mode: "onBlur",
    defaultValues: local
      ? { nome: local.nome, tipo: local.tipo, cidade: local.cidade, bairro: local.bairro, qtPessoas: local.qtPessoas }
      : { nome: "", cidade: "", bairro: "" },
  });

  const tipo = useWatch({ control, name: "tipo" });
  const cidade = useWatch({ control, name: "cidade" }) ?? "";

  async function onSubmit(valores: Valores) {
    setErroApi("");
    try {
      const salvo = local ? await atualizarLocal(local, valores) : await criarLocal(valores);
      if (!local) reset();
      onSalvo(salvo);
    } catch (e) {
      setErroApi(e instanceof Error ? e.message : "Não foi possível salvar o local.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <CampoTexto
        id="local-nome"
        rotulo="Nome do local"
        placeholder="Ex.: Padaria Pão Quente"
        autoComplete="off"
        erro={errors.nome?.message}
        {...register("nome")}
      />

      <CampoSelect id="local-tipo" rotulo="Tipo" erro={errors.tipo?.message} {...register("tipo")}>
        <option value="">Escolha o tipo</option>
        {TIPOS_LOCAL.map((t) => (
          <option key={t} value={t}>
            {rotuloTipo[t]}
          </option>
        ))}
      </CampoSelect>

      <div className="grid gap-4 sm:grid-cols-2">
        <CampoSugestoes
          id="local-cidade"
          rotulo="Cidade"
          valor={cidade}
          sugestoes={cidadesSugeridas}
          onEscolher={(c) => setValue("cidade", c, { shouldValidate: true, shouldDirty: true })}
          erro={errors.cidade?.message}
          {...register("cidade")}
        />
        <CampoTexto id="local-bairro" rotulo="Bairro" autoComplete="off" erro={errors.bairro?.message} {...register("bairro")} />
      </div>

      <CampoTexto
        id="local-pessoas"
        type="number"
        min={1}
        step={1}
        inputMode="numeric"
        rotulo={tipo ? `Nº de ${rotuloPessoas[tipo]}` : "Nº de pessoas"}
        dica="Moradores (casa e comunidade) ou funcionários (negócio)."
        erro={errors.qtPessoas?.message}
        {...register("qtPessoas")}
      />

      {erroApi && <Aviso tipo="erro">{erroApi}</Aviso>}

      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : local ? "Salvar alterações" : "Cadastrar local"}
        </Button>
        {onCancelar && (
          <Button variante="secundario" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
