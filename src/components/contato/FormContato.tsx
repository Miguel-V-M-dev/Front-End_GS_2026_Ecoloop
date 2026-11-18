import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import { assuntosContato, valoresAssunto } from "../../data/contato";
import { criarContato } from "../../services/ecoloopService";
import type { Contato } from "../../types";
import Aviso from "../ui/Aviso";
import Button from "../ui/Button";
import { CampoSelect, CampoTexto, CampoTextarea } from "../ui/Campos";

const MAX_MENSAGEM = 1000;

/** Validações iguais às da API (tb_contato): campos obrigatórios, e-mail válido e tamanhos máximos. */
const esquema = yup.object({
  nome: yup
    .string()
    .trim()
    .required("Informe seu nome.")
    .min(3, "Use pelo menos 3 caracteres.")
    .max(100, "Use no máximo 100 caracteres."),
  email: yup
    .string()
    .trim()
    .required("Informe seu e-mail.")
    .email("Digite um e-mail válido.")
    .max(120, "Use no máximo 120 caracteres."),
  assunto: yup
    .string()
    .required("Escolha o assunto.")
    .oneOf(valoresAssunto, "Escolha o assunto."),
  mensagem: yup
    .string()
    .trim()
    .required("Escreva sua mensagem.")
    .min(10, "Escreva pelo menos 10 caracteres.")
    .max(MAX_MENSAGEM, `Use no máximo ${MAX_MENSAGEM} caracteres.`),
});

type Valores = yup.InferType<typeof esquema>;

/** Formulário da página Contato: envia a mensagem para a API (POST /contatos). */
export default function FormContato({
  onEnviado,
}: {
  onEnviado: (contato: Contato) => void;
}) {
  const [erroApi, setErroApi] = useState("");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Valores>({
    resolver: yupResolver(esquema),
    mode: "onBlur",
    defaultValues: { nome: "", email: "", assunto: "", mensagem: "" },
  });

  const tamanho = (useWatch({ control, name: "mensagem" }) ?? "").length;

  async function onSubmit(valores: Valores) {
    setErroApi("");
    try {
      const contato = await criarContato({
        nome: valores.nome,
        email: valores.email,
        assunto: valores.assunto as Contato["assunto"],
        mensagem: valores.mensagem,
      });
      reset();
      onEnviado(contato);
    } catch (e) {
      setErroApi(
        e instanceof Error ? e.message : "Não foi possível enviar a mensagem.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <CampoTexto
          id="contato-nome"
          rotulo="Nome"
          autoComplete="name"
          placeholder="Ex.: Maria Souza"
          erro={errors.nome?.message}
          {...register("nome")}
        />
        <CampoTexto
          id="contato-email"
          type="email"
          rotulo="E-mail"
          autoComplete="email"
          placeholder="Ex.: maria@email.com"
          erro={errors.email?.message}
          {...register("email")}
        />
      </div>

      <CampoSelect
        id="contato-assunto"
        rotulo="Assunto"
        erro={errors.assunto?.message}
        {...register("assunto")}
      >
        <option value="">Escolha o assunto</option>
        {assuntosContato.map((a) => (
          <option key={a.valor} value={a.valor}>
            {a.rotulo}
          </option>
        ))}
      </CampoSelect>

      <CampoTextarea
        id="contato-mensagem"
        rows={6}
        rotulo="Mensagem"
        placeholder="Conte como podemos ajudar."
        dica={`${tamanho}/${MAX_MENSAGEM} caracteres`}
        erro={errors.mensagem?.message}
        {...register("mensagem")}
      />

      {erroApi && <Aviso tipo="erro">{erroApi}</Aviso>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}
