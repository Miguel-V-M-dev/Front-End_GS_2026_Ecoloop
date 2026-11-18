import type { FaqEntrada } from "../types";

export const faqEntradas: FaqEntrada[] = [
  {
    id: "o-que-e-local",
    pergunta: "O que é um local?",
    resposta:
      "É a casa, a comunidade ou o negócio que você quer acompanhar. Cada local tem nome, tipo, cidade, bairro e a quantidade de pessoas (moradores ou funcionários).",
  },
  {
    id: "meta-mensal",
    pergunta: "O que é a meta mensal?",
    resposta:
      "É o teto de desperdício que o local aceita ter em um mês para um recurso, na unidade dele (litros, kWh ou kg). Passou de 100%, a meta estourou. A partir de 80%, o painel avisa que o limite está perto.",
  },
  {
    id: "custo-co2",
    pergunta: "Como o custo e o CO₂ são calculados?",
    resposta:
      "Multiplicamos a quantidade desperdiçada pelo custo por unidade e pelo fator de CO₂ do recurso. Esses valores de referência são didáticos e não representam tarifas reais.",
  },
  {
    id: "editar-registro",
    pergunta: "Posso corrigir ou apagar um registro?",
    resposta:
      "Sim. No painel do local, cada registro tem botões para editar e excluir. A exclusão pede confirmação antes de apagar.",
  },
  {
    id: "excluir-local",
    pergunta: "Por que não consigo excluir um local?",
    resposta:
      "Locais que já têm registros não podem ser excluídos, para não perder o histórico. As metas do local são removidas junto com ele.",
  },
  {
    id: "data-futura",
    pergunta: "Por que a data do registro não pode ser futura?",
    resposta: "Registramos o que já aconteceu. Em uma data futura o desperdício ainda não existe.",
  },
  {
    id: "meta-duplicada",
    pergunta: "Posso ter mais de uma meta para o mesmo recurso?",
    resposta:
      "Não. Cada local tem uma meta por recurso. Para mudar o valor, edite a meta existente no painel do local.",
  },
  {
    id: "dicas",
    pergunta: "As dicas de economia são garantidas?",
    resposta:
      "Não. Os percentuais de economia são estimativas ilustrativas, feitas para ajudar a escolher por onde começar.",
  },
];
