import { useState } from "react";
import { FiHelpCircle, FiMessageSquare, FiThumbsUp } from "react-icons/fi";
import { Link } from "react-router";
import FormContato from "../components/contato/FormContato";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import PageHero from "../components/ui/PageHero";
import { assuntosContato } from "../data/contato";
import type { Contato as ContatoEnviado } from "../types";
import { formatarData } from "../utils/formatacao";

const motivos = [
  {
    Icone: FiHelpCircle,
    titulo: "Dúvidas",
    texto: "Sobre como registrar, definir metas ou ler o painel.",
    cor: "bg-oceano-100 text-oceano-700",
  },
  {
    Icone: FiMessageSquare,
    titulo: "Sugestões",
    texto: "Ideias de recursos, causas ou dicas que faltam.",
    cor: "bg-brand-100 text-brand-700",
  },
  {
    Icone: FiThumbsUp,
    titulo: "Elogios e parcerias",
    texto: "Conte o que funcionou ou proponha um projeto em conjunto.",
    cor: "bg-energia-fraco text-energia-escuro",
  },
];

/** /contato: formulário de contato (POST /contatos) com validação e retorno da API. */
export default function Contato() {
  const [enviado, setEnviado] = useState<ContatoEnviado | null>(null);
  const assunto = assuntosContato.find((a) => a.valor === enviado?.assunto);

  return (
    <>
      <PageHero titulo="Contato">
        <p>
          Tem uma dúvida, sugestão ou encontrou um problema? Escreva para a
          equipe Ecoloop.
        </p>
      </PageHero>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card>
          <FormContato onEnviado={setEnviado} />
        </Card>

        <aside className="h-fit space-y-4">
          <h2 className="text-lg font-bold text-brand-950">
            Sobre o que você pode falar
          </h2>
          <ul className="space-y-3">
            {motivos.map(({ Icone, titulo, texto, cor }) => (
              <li
                key={titulo}
                className="flex gap-3 rounded-lg border border-linha bg-white p-4"
              >
                <span
                  aria-hidden="true"
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${cor}`}
                >
                  <Icone size={20} />
                </span>
                <div>
                  <h3 className="font-bold text-brand-950">{titulo}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {texto}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-sm leading-relaxed text-slate-600">
            Antes de enviar, veja se a resposta já está no{" "}
            <Link
              to="/faq"
              className="font-semibold text-oceano-700 hover:underline"
            >
              FAQ
            </Link>
            .
          </p>
        </aside>
      </div>

      <Modal
        aberto={Boolean(enviado)}
        titulo="Mensagem enviada!"
        onFechar={() => setEnviado(null)}
      >
        {enviado && (
          <div className="space-y-5">
            <p className="text-sm leading-relaxed">
              Obrigado, <strong>{enviado.nome}</strong>! Recebemos sua mensagem
              {assunto ? ` (${assunto.rotulo.toLowerCase()})` : ""} em{" "}
              {formatarData(enviado.dataEnvio)}.
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <Button variante="secundario" onClick={() => setEnviado(null)}>
                Enviar outra
              </Button>
              <Button to="/">Voltar ao início</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
