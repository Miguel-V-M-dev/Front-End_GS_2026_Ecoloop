import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";

const TITULO_BASE = "Ecoloop | Desperdício Zero";

/** Título da aba conforme a rota (ajuda quem navega por abas e leitores de tela). */
function tituloDaRota(pathname: string): string {
  if (pathname === "/") return TITULO_BASE;
  const nome = pathname.startsWith("/locais/")
    ? "Painel do local"
    : (
        {
          "/locais": "Locais",
          "/registrar": "Registrar desperdício",
          "/sobre": "Sobre",
          "/integrantes": "Integrantes",
          "/faq": "FAQ",
          "/contato": "Contato",
        } as Record<string, string>
      )[pathname];
  return nome ? `${nome} | Ecoloop` : `Página não encontrada | Ecoloop`;
}

/** Layout das páginas: cabeçalho, conteúdo da rota (Outlet) e rodapé. */
export default function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    document.title = tituloDaRota(pathname);
  }, [pathname]);

  // Ao trocar de página volta ao topo; com #ancora, rola até o elemento.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:font-semibold focus:text-brand-800"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
