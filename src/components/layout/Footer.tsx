import { Link } from "react-router";
import AnelDecor from "../ui/AnelDecor";
import Logo from "../ui/Logo";

export default function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-gradient-to-r from-brand-950 via-brand-900 to-oceano-900 text-oceano-100">
      <AnelDecor className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 text-white/5" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3 text-brand-200">
          <Logo className="h-9 w-9" gotaClasse="fill-oceano-300" />
          <div>
            <p className="font-display text-lg font-bold leading-tight text-white">Ecoloop</p>
            <p className="text-oceano-100">Desperdício Zero, Global Solution 2026/2 (CitizenTech), FIAP.</p>
          </div>
        </div>
        <p>
          Feito pela equipe Ecoloop.{" "}
          <Link
            to="/integrantes"
            className="font-semibold text-white underline decoration-oceano-300 underline-offset-4 hover:decoration-white"
          >
            Conheça os integrantes
          </Link>
        </p>
      </div>
    </footer>
  );
}
