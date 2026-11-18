import type { ButtonHTMLAttributes } from "react";
import { Link } from "react-router";

type Variante = "primario" | "secundario" | "perigo" | "texto";
type Tamanho = "md" | "sm";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  variante?: Variante;
  tamanho?: Tamanho;
  className?: string;
  /** Com `to`, o botão vira um <Link> (ou um <a> se começar com "#"). Sem `to`, é um <button>. */
  to?: string;
};

const classesVariante: Record<Variante, string> = {
  primario: "bg-brand-700 text-white hover:bg-brand-800",
  secundario: "border border-oceano-600 text-oceano-700 hover:bg-oceano-50",
  perigo: "bg-alerta text-white hover:bg-red-800",
  texto: "text-oceano-700 hover:bg-oceano-50",
};

const classesTamanho: Record<Tamanho, string> = {
  md: "px-5 py-2.5 text-sm",
  sm: "px-3 py-1.5 text-sm",
};

export default function Button({
  variante = "primario",
  tamanho = "md",
  className = "",
  to,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  const classes =
    "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors " +
    "disabled:cursor-not-allowed disabled:opacity-50 " +
    `${classesTamanho[tamanho]} ${classesVariante[variante]} ${className}`;

  if (to?.startsWith("#")) {
    return (
      <a href={to} className={classes}>
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
