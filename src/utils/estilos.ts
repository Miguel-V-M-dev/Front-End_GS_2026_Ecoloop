/** Classes comuns dos campos de formulário (input, select e textarea). */
export function classesCampo(temErro: boolean): string {
  return (
    "w-full rounded-md border bg-white px-3 py-2.5 text-sm text-tinta outline-none transition-colors " +
    "placeholder:text-slate-400 focus:border-oceano-500 focus:ring-2 focus:ring-oceano-200 " +
    "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 " +
    (temErro ? "border-alerta" : "border-linha-forte")
  );
}
