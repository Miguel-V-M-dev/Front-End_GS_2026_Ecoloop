import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { rotuloUnidade, unidadePorExtenso } from "../../data/rotulos";
import { atualizarMeta, criarMeta, excluirMeta } from "../../services/ecoloopService";
import type { Id, Meta, Recurso } from "../../types";
import { hojeISO } from "../../utils/formatacao";
import Aviso from "../ui/Aviso";
import Button from "../ui/Button";
import { CampoData, CampoTexto } from "../ui/Campos";

const vazioParaIndefinido = (valor: unknown, original: unknown) => (original === "" ? undefined : valor);

// qt_meta_mensal NUMBER(10,2), CHECK > 0
const esquema = yup.object({
  metaMensal: yup
    .number()
    .transform(vazioParaIndefinido)
    .typeError("Digite apenas números.")
    .required("Informe a meta mensal.")
    .moreThan(0, "A meta precisa ser maior que zero.")
    .max(99999999.99, "Valor alto demais.")
    .test("duas-casas", "Use no máximo 2 casas decimais.", (valor) => valor === undefined || Math.abs(valor * 100 - Math.round(valor * 100)) < 1e-6),
  dataInicio: yup
    .string()
    .required("Informe a data de início.")
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Data inválida."),
});

type Valores = yup.InferType<typeof esquema>;

interface FormMetaProps {
  localId: Id;
  recurso: Recurso;
  /** Meta atual do recurso neste local; null para criar uma nova. */
  meta: Meta | null;
  onSalvo: () => void;
  onRemovido: () => void;
  onCancelar: () => void;
}

/** Define, ajusta ou remove a meta mensal (tb_meta) de um recurso em um local. */
export default function FormMeta({ localId, recurso, meta, onSalvo, onRemovido, onCancelar }: FormMetaProps) {
  const [erroApi, setErroApi] = useState("");
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false);
  const [removendo, setRemovendo] = useState(false);
  const unidade = rotuloUnidade[recurso.unidade];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<Valores>({
    resolver: yupResolver(esquema),
    mode: "onBlur",
    defaultValues: { metaMensal: meta?.metaMensal, dataInicio: meta?.dataInicio ?? hojeISO() },
  });

  async function onSubmit({ metaMensal, dataInicio }: Valores) {
    setErroApi("");
    try {
      const dados = { localId, recursoId: recurso.id, metaMensal, dataInicio };
      if (meta) await atualizarMeta(meta.id, dados);
      else await criarMeta(dados);
      onSalvo();
    } catch (e) {
      setErroApi(e instanceof Error ? e.message : "Não foi possível salvar a meta.");
    }
  }

  async function remover() {
    if (!meta) return;
    setErroApi("");
    setRemovendo(true);
    try {
      await excluirMeta(meta.id);
      onRemovido();
    } catch (e) {
      setErroApi(e instanceof Error ? e.message : "Não foi possível remover a meta.");
      setRemovendo(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <p className="text-sm text-slate-600">
        A meta é o teto de desperdício de <strong>{recurso.nome.toLowerCase()}</strong> por mês. Passou de 100%, ela
        estoura.
      </p>

      <CampoTexto
        id="meta-valor"
        type="number"
        step="0.01"
        min="0"
        inputMode="decimal"
        rotulo={`Meta mensal (${unidade})`}
        dica={`Quantidade máxima em ${unidadePorExtenso[recurso.unidade]}s por mês.`}
        erro={errors.metaMensal?.message}
        {...register("metaMensal")}
      />
      <Controller
        name="dataInicio"
        control={control}
        render={({ field }) => (
          <CampoData
            id="meta-inicio"
            rotulo="Início da meta"
            valor={field.value ?? ""}
            onChange={field.onChange}
            onBlur={field.onBlur}
            name={field.name}
            erro={errors.dataInicio?.message}
          />
        )}
      />

      {erroApi && <Aviso tipo="erro">{erroApi}</Aviso>}

      <div className="flex flex-wrap items-center gap-3 pt-1">
        <Button type="submit" disabled={isSubmitting || removendo}>
          {isSubmitting ? "Salvando..." : meta ? "Salvar meta" : "Definir meta"}
        </Button>
        <Button variante="secundario" onClick={onCancelar} disabled={removendo}>
          Cancelar
        </Button>
        {meta &&
          (confirmandoRemocao ? (
            <span className="ml-auto flex items-center gap-2 text-sm">
              <span className="text-slate-600">Remover esta meta?</span>
              <Button variante="perigo" tamanho="sm" onClick={remover} disabled={removendo}>
                {removendo ? "Removendo..." : "Sim, remover"}
              </Button>
              <Button variante="texto" tamanho="sm" onClick={() => setConfirmandoRemocao(false)} disabled={removendo}>
                Voltar
              </Button>
            </span>
          ) : (
            <Button variante="texto" tamanho="sm" className="ml-auto text-alerta hover:bg-alerta-fraco" onClick={() => setConfirmandoRemocao(true)}>
              Remover meta
            </Button>
          ))}
      </div>
    </form>
  );
}
