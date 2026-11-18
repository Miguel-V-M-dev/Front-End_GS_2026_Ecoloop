const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/** R$ 1.234,50 */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** 1.234,5 (até `casasMaximas` casas decimais, sem zeros sobrando). */
export function formatarNumero(valor: number, casasMaximas = 2): string {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: casasMaximas });
}

/** CO₂ em kg; valores minúsculos viram "menos de 0,01 kg". */
export function formatarCo2(kg: number): string {
  if (kg > 0 && kg < 0.01) return "menos de 0,01 kg";
  return `${formatarNumero(kg)} kg`;
}

/**
 * "2026-11-05" -> "05/11/2026". Feito por texto (sem `new Date`) para o fuso horário
 * não "voltar um dia" em datas sem hora.
 */
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.slice(0, 10).split("-");
  return `${dia}/${mes}/${ano}`;
}

/** Data de hoje no fuso do usuário, no formato aaaa-mm-dd. */
export function hojeISO(): string {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

/** Mês de uma data ISO: "2026-11-05" -> "2026-11". */
export function mesDe(iso: string): string {
  return iso.slice(0, 7);
}

export function mesAtual(): string {
  return mesDe(hojeISO());
}

/** "2026-11" -> "novembro de 2026". */
export function formatarMes(anoMes: string): string {
  const [ano, mes] = anoMes.split("-");
  return `${MESES[Number(mes) - 1]} de ${ano}`;
}
