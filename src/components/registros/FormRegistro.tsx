import { yupResolver } from "@hookform/resolvers/yup";
import { useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { useReferencia } from "../../context/useReferencia";
import { estiloDoRecurso } from "../../data/icones";
import { rotuloUnidade } from "../../data/rotulos";
import { atualizarRegistro, criarRegistro } from "../../services/ecoloopService";
import type { Causa, Id, Local, Registro } from "../../types";
import { hojeISO } from "../../utils/formatacao";
import { compararNomes } from "../../utils/ordenacao";
import Aviso from "../ui/Aviso";
import Button from "../ui/Button";
import { CampoData, CampoSelect, CampoTexto, CampoTextarea } from "../ui/Campos";
import IconeRecurso from "../ui/IconeRecurso";

const vazioParaIndefinido = (valor: unknown, original: unknown) => (original === "" ? undefined : valor);

/**
 * Validações do registro (iguais às da API: quantidade > 0, data não futura, campos obrigatórios).
 * Recebe as causas para conferir se a causa pertence ao recurso (FK composta em tb_registro).
 */
function criarEsquema(causas: Causa[]) {
  return yup.object({
    localId: yup.string().required("Escolha o local."),
    recursoId: yup.string().required("Escolha o recurso."),
    causaId: yup
      .string()
      .required("Escolha a causa.")
      .test("causa-do-recurso", "Essa causa não pertence ao recurso escolhido.", (valor, ctx) => {
        const causa = causas.find((c) => c.id === valor);
        return Boolean(causa) && causa?.recursoId === ctx.parent.recursoId;
      }),
    quantidade: yup
      .number()
      .transform(vazioParaIndefinido)
      .typeError("Digite apenas números.")
      .required("Informe a quantidade.")
      .moreThan(0, "A quantidade precisa ser maior que zero.")
      .max(99999999.99, "Valor alto demais.")
      .test(
        "duas-casas",
        "Use no máximo 2 casas decimais.",
        (valor) => valor === undefined || Math.abs(valor * 100 - Math.round(valor * 100)) < 1e-6,
      ),
    data: yup
      .string()
      .required("Informe a data.")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.")
      .test("nao-futura", "A data não pode ser no futuro.", (valor) => !valor || valor <= hojeISO()),
    observacao: yup.string().trim().max(200, "Use no máximo 200 caracteres.").default(""),
  });
}

type Valores = yup.InferType<ReturnType<typeof criarEsquema>>;

interface FormRegistroProps {
  locais: Local[];
  /** Local já selecionado ao abrir (ex.: vindo do painel). */
  localIdInicial?: Id;
  /** Se informado, o formulário edita este registro (PUT); senão cria um novo (POST). */
  registro?: Registro;
  onSalvo: (registro: Registro) => void;
  onCancelar?: () => void;
}

/** Formulário de registro de desperdício: usado em /registrar (criar) e no painel (editar). */
export default function FormRegistro({ locais, localIdInicial, registro, onSalvo, onCancelar }: FormRegistroProps) {
  const { recursos, causas, recursoPorId, causasDoRecurso } = useReferencia();
  const [erroApi, setErroApi] = useState("");
  const esquema = useMemo(() => criarEsquema(causas), [causas]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm<Valores>({
    resolver: yupResolver(esquema),
    mode: "onBlur",
    defaultValues: registro
      ? {
          localId: registro.localId,
          recursoId: registro.recursoId,
          causaId: registro.causaId,
          quantidade: registro.quantidade,
          data: registro.data,
          observacao: registro.observacao ?? "",
        }
      : { localId: localIdInicial ?? "", data: hojeISO(), observacao: "" },
  });

  const recursoId = useWatch({ control, name: "recursoId" });
  const recurso = recursoId ? recursoPorId(recursoId) : undefined;
  const causasDisponiveis = recursoId ? causasDoRecurso(recursoId) : [];
  const tamanhoObservacao = (useWatch({ control, name: "observacao" }) ?? "").length;
  const unidade = recurso ? rotuloUnidade[recurso.unidade] : "";

  async function onSubmit(valores: Valores) {
    setErroApi("");
    try {
      const dados = {
        localId: valores.localId,
        recursoId: valores.recursoId,
        causaId: valores.causaId,
        quantidade: valores.quantidade,
        data: valores.data,
        observacao: valores.observacao ? valores.observacao : null,
      };
      const salvo = registro ? await atualizarRegistro(registro.id, dados) : await criarRegistro(dados);
      // Depois de criar, limpa o que muda a cada registro e mantém o local e a data.
      // (resetField limpa também o campo na tela; reset() parcial não limpa campos sem valor padrão.)
      if (!registro) {
        for (const campo of ["recursoId", "causaId", "quantidade", "observacao"] as const) resetField(campo);
      }
      onSalvo(salvo);
    } catch (e) {
      setErroApi(e instanceof Error ? e.message : "Não foi possível salvar o registro.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <CampoSelect
        id="registro-local"
        rotulo="Local"
        disabled={Boolean(registro)}
        erro={errors.localId?.message}
        {...register("localId")}
      >
        <option value="">Escolha o local</option>
        {[...locais]
          .sort((a, b) => compararNomes(a.nome, b.nome))
          .map((l) => (
            <option key={l.id} value={l.id}>
              {l.nome} ({l.bairro})
            </option>
          ))}
      </CampoSelect>

      <fieldset>
        <legend className="mb-1 text-sm font-semibold text-tinta">Recurso</legend>
        <div className="grid grid-cols-3 gap-2">
          {recursos.map((r) => {
            const marcado = recursoId === r.id;
            return (
              <label
                key={r.id}
                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-md border px-2 py-3 text-center text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-oceano-500 ${
                  marcado
                    ? "border-oceano-600 bg-oceano-50 text-oceano-900"
                    : "border-linha-forte bg-white text-slate-700 hover:border-oceano-400"
                }`}
              >
                <input
                  type="radio"
                  value={r.id}
                  className="sr-only"
                  {...register("recursoId", { onChange: () => setValue("causaId", "") })}
                />
                <IconeRecurso unidade={r.unidade} tamanho="sm" />
                {r.nome}
                <span className={`text-xs font-normal ${estiloDoRecurso(r.unidade).texto}`}>{rotuloUnidade[r.unidade]}</span>
              </label>
            );
          })}
        </div>
        {errors.recursoId && (
          <p role="alert" className="mt-1 text-xs font-medium text-alerta">
            {errors.recursoId.message}
          </p>
        )}
      </fieldset>

      <CampoSelect
        id="registro-causa"
        rotulo="Causa do desperdício"
        disabled={!recursoId}
        erro={errors.causaId?.message}
        {...register("causaId")}
      >
        <option value="">{recursoId ? "Escolha a causa" : "Escolha o recurso primeiro"}</option>
        {causasDisponiveis.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome}
          </option>
        ))}
      </CampoSelect>

      <div className="grid gap-4 sm:grid-cols-2">
        <CampoTexto
          id="registro-quantidade"
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          rotulo={unidade ? `Quantidade desperdiçada (${unidade})` : "Quantidade desperdiçada"}
          placeholder="Ex.: 12,5"
          erro={errors.quantidade?.message}
          {...register("quantidade")}
        />
        <Controller
          name="data"
          control={control}
          render={({ field }) => (
            <CampoData
              id="registro-data"
              rotulo="Data"
              valor={field.value ?? ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              erro={errors.data?.message}
            />
          )}
        />
      </div>

      <CampoTextarea
        id="registro-observacao"
        rows={3}
        rotulo="Observação (opcional)"
        placeholder="Ex.: Torneira da cozinha pingando"
        dica={`${tamanhoObservacao}/200 caracteres`}
        erro={errors.observacao?.message}
        {...register("observacao")}
      />

      {erroApi && <Aviso tipo="erro">{erroApi}</Aviso>}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : registro ? "Salvar alterações" : "Salvar registro"}
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
