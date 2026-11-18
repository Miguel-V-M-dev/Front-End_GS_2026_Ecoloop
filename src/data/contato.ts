import type { AssuntoContato } from "../types";

// A API guarda o valor sem acento (CHECK ck_contato_assunto); aqui só o rótulo exibido.
export const assuntosContato: { valor: AssuntoContato; rotulo: string }[] = [
  { valor: "DUVIDA", rotulo: "Dúvida" },
  { valor: "SUGESTAO", rotulo: "Sugestão" },
  { valor: "PROBLEMA", rotulo: "Problema no site" },
  { valor: "ELOGIO", rotulo: "Elogio" },
  { valor: "PARCERIA", rotulo: "Parceria" },
];

export const valoresAssunto: string[] = assuntosContato.map((a) => a.valor);
