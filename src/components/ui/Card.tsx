import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** Superfície branca com borda fina, sem sombra: o destaque fica nos dados. */
export default function Card({ children, className = "" }: CardProps) {
  return <div className={`rounded-lg border border-linha bg-white p-5 sm:p-6 ${className}`}>{children}</div>;
}
