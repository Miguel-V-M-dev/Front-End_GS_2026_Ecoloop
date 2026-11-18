import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  FiAlertCircle,
  FiBarChart2,
  FiCheckCircle,
  FiCode,
} from "react-icons/fi";
import { Link } from "react-router";
import AnelDecor from "../components/ui/AnelDecor";
import PageHero from "../components/ui/PageHero";
import { acentoDe } from "../data/icones";

const ods = [
  {
    numero: "6",
    nome: "Água potável e saneamento",
    texto: "Menos água perdida em vazamentos e usos sem necessidade.",
  },
  {
    numero: "7",
    nome: "Energia limpa e acessível",
    texto: "Menos energia gasta em aparelhos e luzes ligados sem uso.",
  },
  {
    numero: "11",
    nome: "Cidades e comunidades sustentáveis",
    texto: "Comunidades e bairros que acompanham o próprio consumo.",
  },
  {
    numero: "12",
    nome: "Consumo e produção responsáveis",
    texto:
      "Menos comida jogada fora, em linha com a meta de reduzir pela metade o desperdício de alimentos até 2030.",
  },
];

const solucao = [
  "Cadastra os locais: casas, comunidades e negócios.",
  "Registra cada desperdício, com recurso, quantidade, causa e data.",
  "Compara o total do mês com uma meta mensal por recurso, em réguas fáceis de ler.",
  "Estima o custo em reais e o CO₂ do que foi desperdiçado.",
  "Sugere dicas para os recursos em que cada local mais desperdiça.",
];

const tecnologias = [
  "React, Vite e TypeScript no front-end.",
  "Tailwind CSS para o visual e a responsividade.",
  "React Router, com rota de parâmetro no painel do local.",
  "React Hook Form e Yup para os formulários e as validações.",
  "API Java (Spring Boot) publicada no Render, com banco Oracle.",
];

type Cor = "brand" | "oceano" | "alimento";

const coresSecao: Record<Cor, { faixa: string; icone: string }> = {
  brand: { faixa: "bg-brand-500", icone: "bg-brand-100 text-brand-700" },
  oceano: { faixa: "bg-oceano-500", icone: "bg-oceano-100 text-oceano-700" },
  alimento: { faixa: "bg-alimento", icone: "bg-alimento-fraco text-alimento" },
};

interface SecaoProps {
  id: string;
  titulo: string;
  Icone: IconType;
  cor: Cor;
  children: ReactNode;
}

/** Cartão de uma seção da página: faixa colorida no topo, ícone e título. */
function Secao({ id, titulo, Icone, cor, children }: SecaoProps) {
  const estilo = coresSecao[cor];
  return (
    <section
      aria-labelledby={id}
      className="overflow-hidden rounded-lg border border-linha bg-white"
    >
      <div aria-hidden="true" className={`h-1.5 ${estilo.faixa}`} />
      <div className="grid gap-5 p-6 lg:grid-cols-[1fr_2fr] lg:gap-10 lg:p-8">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${estilo.icone}`}
          >
            <Icone size={22} />
          </span>
          <h2
            id={id}
            className="pt-1.5 text-2xl font-bold leading-tight text-brand-950"
          >
            {titulo}
          </h2>
        </div>
        <div className="max-w-2xl">{children}</div>
      </div>
    </section>
  );
}

export default function Sobre() {
  return (
    <>
      <PageHero titulo="Sobre o Desperdício Zero">
        <p>
          É a solução da equipe Ecoloop para a Global Solution 2026/2
          (CitizenTech), na ideia 04: reduzir o desperdício de água, energia e
          alimentos em casas, comunidades e pequenos negócios.
        </p>
      </PageHero>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-12 sm:px-6">
        <Secao
          id="titulo-problema"
          titulo="O problema"
          Icone={FiAlertCircle}
          cor="alimento"
        >
          <p className="leading-relaxed text-slate-700">
            Uma torneira pingando, um aparelho ligado sem ninguém usar e a
            comida que estraga na geladeira têm algo em comum: quase ninguém
            mede. Sem medir, não dá para saber onde agir primeiro nem se a
            situação melhorou de um mês para o outro.
          </p>
        </Secao>

        <Secao
          id="titulo-solucao"
          titulo="O que a solução faz"
          Icone={FiCheckCircle}
          cor="brand"
        >
          <ul className="space-y-3 leading-relaxed text-slate-700">
            {solucao.map((item) => (
              <li key={item} className="flex gap-3">
                <FiCheckCircle
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-brand-500"
                />
                {item}
              </li>
            ))}
          </ul>
        </Secao>

        <Secao
          id="titulo-calculo"
          titulo="Como os números são calculados"
          Icone={FiBarChart2}
          cor="oceano"
        >
          <div className="space-y-4 leading-relaxed text-slate-700">
            <p>
              O custo é a quantidade desperdiçada vezes o custo por unidade do
              recurso. O CO₂ é a quantidade vezes o fator de CO₂ do recurso.
            </p>
            <p>
              A meta é um teto: a partir de{" "}
              <span className="rounded-full bg-energia-fraco px-2 py-0.5 text-sm font-semibold text-energia-escuro">
                80%
              </span>{" "}
              o painel avisa que o limite está perto, e acima de{" "}
              <span className="rounded-full bg-alerta-fraco px-2 py-0.5 text-sm font-semibold text-alerta">
                100%
              </span>{" "}
              ela estourou.
            </p>
            <p className="rounded-md bg-oceano-50 px-4 py-3 text-sm text-oceano-900">
              Os custos, os fatores de CO₂ e os percentuais de economia das
              dicas são valores de referência, criados para fins didáticos. Em
              um produto real, eles seriam trocados por tarifas e fatores
              oficiais.
            </p>
          </div>
        </Secao>

        <section aria-labelledby="titulo-ods" className="pt-6">
          <h2 id="titulo-ods" className="text-2xl font-bold text-brand-950">
            Objetivos de Desenvolvimento Sustentável
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {ods.map((item, indice) => {
              const acento = acentoDe(indice);
              return (
                <li
                  key={item.numero}
                  className={`flex gap-4 rounded-lg border border-l-4 border-linha bg-white p-5 ${acento.lateral}`}
                >
                  <span
                    aria-hidden="true"
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg font-display text-xl font-extrabold ${acento.fundo} ${acento.texto}`}
                  >
                    {item.numero}
                  </span>
                  <div>
                    <h3 className="font-bold leading-snug text-brand-950">
                      <span className="sr-only">ODS {item.numero}: </span>
                      {item.nome}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {item.texto}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="pt-6">
          <Secao
            id="titulo-tecnologia"
            titulo="Tecnologia"
            Icone={FiCode}
            cor="oceano"
          >
            <ul className="space-y-3 leading-relaxed text-slate-700">
              {tecnologias.map((item, indice) => (
                <li key={item} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${["bg-brand-500", "bg-oceano-500", "bg-energia", "bg-alimento", "bg-brand-500"][indice % 5]}`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Secao>
        </div>

        <div className="relative flex flex-wrap items-center justify-between gap-6 overflow-hidden rounded-lg bg-gradient-to-r from-brand-800 via-brand-900 to-oceano-800 px-6 py-8 sm:px-10">
          <AnelDecor className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 text-white/10" />
          <p className="relative text-lg font-semibold text-white">
            Quer ver funcionando?
          </p>
          <Link
            to="/locais"
            className="relative inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-bold text-brand-900 hover:bg-oceano-50"
          >
            Abra a lista de locais
          </Link>
        </div>
      </div>
    </>
  );
}
