import { useState, type ReactNode } from "react";
import Aviso from "./Aviso";
import Button from "./Button";
import Modal from "./Modal";

interface ModalConfirmarProps {
  titulo: string;
  children: ReactNode;
  rotuloConfirmar: string;
  /** Executa a exclusão. Se lançar erro (ex.: 409 da API), a mensagem aparece na janela. */
  onConfirmar: () => Promise<void>;
  onFechar: () => void;
}

/**
 * Confirmação de exclusão (DELETE) com feedback da API. Renderize-o só quando for usar
 * ({alvo && <ModalConfirmar ... />}), assim o estado de erro começa limpo a cada abertura.
 */
export default function ModalConfirmar({ titulo, children, rotuloConfirmar, onConfirmar, onFechar }: ModalConfirmarProps) {
  const [pendente, setPendente] = useState(false);
  const [erro, setErro] = useState("");

  async function confirmar() {
    setPendente(true);
    setErro("");
    try {
      await onConfirmar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Não foi possível concluir a ação.");
      setPendente(false);
    }
  }

  return (
    <Modal aberto titulo={titulo} onFechar={onFechar}>
      <div className="space-y-4">
        <div className="space-y-2 text-sm leading-relaxed">{children}</div>
        {erro && <Aviso tipo="erro">{erro}</Aviso>}
        <div className="flex flex-wrap justify-end gap-3">
          <Button variante="secundario" onClick={onFechar} disabled={pendente}>
            Cancelar
          </Button>
          <Button variante="perigo" onClick={confirmar} disabled={pendente}>
            {pendente ? "Excluindo..." : rotuloConfirmar}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
