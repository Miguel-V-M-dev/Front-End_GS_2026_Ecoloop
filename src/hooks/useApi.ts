import { useCallback, useEffect, useState } from "react";
import { ApiError } from "../services/api";

interface Estado<T> {
  chave: string;
  dados?: T;
  erro?: string;
  status?: number;
}

/**
 * Executa uma chamada assíncrona e entrega { dados, erro, carregando }.
 * - `chave` identifica a consulta: quando muda, a consulta roda de novo.
 * - `recarregar()` refaz a consulta SEM apagar a tela (os dados antigos ficam até chegarem os novos).
 * - `definir(dados)` troca os dados localmente (útil logo após um POST ou DELETE).
 */
export function useApi<T>(buscar: () => Promise<T>, chave: string) {
  const [versao, setVersao] = useState(0);
  const [estado, setEstado] = useState<Estado<T> | null>(null);

  useEffect(() => {
    let cancelado = false;
    buscar()
      .then((dados) => {
        if (!cancelado) setEstado({ chave, dados });
      })
      .catch((e: unknown) => {
        if (cancelado) return;
        setEstado((anterior) => ({
          chave,
          // Se uma atualização falhar, a tela continua com os dados que já tinha.
          dados: anterior?.chave === chave ? anterior.dados : undefined,
          erro: e instanceof Error ? e.message : "Não foi possível carregar os dados.",
          status: e instanceof ApiError ? e.status : undefined,
        }));
      });
    return () => {
      cancelado = true;
    };
    // `buscar` é recriada a cada render; `chave` e `versao` controlam quando buscar de novo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chave, versao]);

  const atual = estado?.chave === chave ? estado : null;

  const definir = useCallback((dados: T) => setEstado({ chave, dados }), [chave]);

  const recarregar = useCallback(() => {
    // Depois de um erro sem dados, volta para o estado "carregando" ao tentar de novo.
    setEstado((anterior) => (anterior?.erro && !anterior.dados ? null : anterior));
    setVersao((n) => n + 1);
  }, []);

  return {
    dados: atual?.dados,
    erro: atual?.erro,
    status: atual?.status,
    carregando: !atual,
    recarregar,
    definir,
  };
}
