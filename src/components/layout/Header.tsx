import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink } from "react-router";
import Logo from "../ui/Logo";

const links = [
  { to: "/", rotulo: "Início", end: true },
  { to: "/locais", rotulo: "Locais" },
  { to: "/registrar", rotulo: "Registrar" },
  { to: "/sobre", rotulo: "Sobre" },
  { to: "/integrantes", rotulo: "Integrantes" },
  { to: "/faq", rotulo: "FAQ" },
  { to: "/contato", rotulo: "Contato" },
];

const classesLink = ({ isActive }: { isActive: boolean }) =>
  `whitespace-nowrap border-b-2 px-1 py-2 text-sm font-semibold transition-colors ${
    isActive ? "border-oceano-600 text-oceano-800" : "border-transparent text-slate-600 hover:text-oceano-700"
  }`;

export default function Header() {
  // useState: controla a visibilidade do menu no celular.
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-oceano-100 bg-gradient-to-r from-brand-50/95 via-white/95 to-oceano-50/95 backdrop-blur">
      <div aria-hidden="true" className="h-1 bg-gradient-to-r from-brand-500 via-oceano-400 to-oceano-600" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 text-brand-800" onClick={() => setMenuAberto(false)}>
          <Logo className="h-8 w-8" />
          <span className="font-display text-xl font-bold leading-none tracking-tight text-brand-900">Ecoloop</span>
          <span className="hidden text-sm text-slate-500 sm:inline">Desperdício Zero</span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-5 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={classesLink}>
              {link.rotulo}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-oceano-800 hover:bg-oceano-50 lg:hidden"
          aria-expanded={menuAberto}
          aria-controls="menu-mobile"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuAberto((atual) => !atual)}
        >
          {menuAberto ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {menuAberto && (
        <nav
          id="menu-mobile"
          aria-label="Principal"
          className="flex flex-col gap-1 border-t border-linha bg-white px-4 py-3 lg:hidden"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMenuAberto(false)}
              className={({ isActive }) =>
                `rounded-md px-3 py-2.5 text-sm font-semibold ${
                  isActive ? "bg-oceano-50 text-oceano-800" : "text-slate-700 hover:bg-slate-50"
                }`
              }
            >
              {link.rotulo}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
