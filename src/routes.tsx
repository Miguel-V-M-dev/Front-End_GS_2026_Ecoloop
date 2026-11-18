import { createBrowserRouter, type RouteObject } from "react-router";
import App from "./App";
import Contato from "./pages/Contato";
import Faq from "./pages/Faq";
import Home from "./pages/Home";
import Integrantes from "./pages/Integrantes";
import LocalPainel from "./pages/LocalPainel";
import Locais from "./pages/Locais";
import NotFound from "./pages/NotFound";
import Registrar from "./pages/Registrar";
import Sobre from "./pages/Sobre";

/**
 * Mapa de rotas. As três páginas da solução:
 *   /locais       lista (GET) e cadastro (POST) de locais
 *   /locais/:id   painel do local (rota com parâmetro)
 *   /registrar    registro de desperdício (POST)
 * Também: /contato (mensagem para a equipe, POST /contatos).
 */
export const rotas: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "locais", element: <Locais /> },
      { path: "locais/:id", element: <LocalPainel /> },
      { path: "registrar", element: <Registrar /> },
      { path: "sobre", element: <Sobre /> },
      { path: "integrantes", element: <Integrantes /> },
      { path: "faq", element: <Faq /> },
      { path: "contato", element: <Contato /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(rotas);
