import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import ReferenciaProvider from "./context/ReferenciaProvider";
import { router } from "./routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* Recursos, causas e dicas são carregados uma vez e usados em várias páginas (useContext). */}
    <ReferenciaProvider>
      <RouterProvider router={router} />
    </ReferenciaProvider>
  </StrictMode>,
);
