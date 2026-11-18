import { createBrowserRouter, type RouteObject } from "react-router";
import App from "./App";
import Faq from "./pages/Faq";
import Integrantes from "./pages/Integrantes";
import NotFound from "./pages/NotFound";
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
      { path: "integrantes", element: <Integrantes /> },
      { path: "faq", element: <Faq /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(rotas);
