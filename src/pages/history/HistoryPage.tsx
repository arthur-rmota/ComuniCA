// Arquivo: src/pages/history/HistoryPage.tsx
// Observação: as cores usam valores aproximados do ComuniCA (creme, laranja e marrom).
// Se o tema do projeto tiver classes ou tokens próprios, troque os valores entre colchetes.

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, Loader2, RotateCcw, Trash2, Volume2 } from "lucide-react";
import { clearHistory, getHistory } from "../../services/historyService";
import { speak } from "../../utils/speech";

type HistoryItem = Awaited<ReturnType<typeof getHistory>>[number];
type LoadStatus = "loading" | "ready" | "error";

function formatDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const loadHistory = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await getHistory();
      setItems(data);
      setStatus("ready");
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  function handlePlay(item: HistoryItem) {
    setActionError(null);
    let started = false;

    speak(
      item.text,
      () => {
        started = true;
        setPlayingId(item.id);
      },
      () => {
        setPlayingId(null);
        if (!started) {
          setActionError(`Não foi possível reproduzir a mensagem: "${item.text}".`);
        }
      }
    );
  }

  async function handleConfirmClear() {
    setClearing(true);
    setActionError(null);
    try {
      await clearHistory();
      setItems([]);
      setStatus("ready");
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
      setActionError("Não foi possível limpar o histórico. Tente novamente.");
    } finally {
      setClearing(false);
      setConfirmOpen(false);
    }
  }

  const isEmpty = status === "ready" && items.length === 0;
  const hasItems = status === "ready" && items.length > 0;

  return (
    <div className="min-h-screen bg-[#FFF8EE] text-[#5C3A21]">
      <div className="mx-auto flex max-w-xl flex-col gap-4 p-4">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="Voltar"
            className="rounded-full bg-white p-2 shadow-sm"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">Histórico</h1>
        </header>

        {status === "loading" && (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-white p-6 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando histórico...</span>
          </div>
        )}

        {status === "error" && (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-sm"
          >
            <AlertTriangle className="h-8 w-8" />
            <p>Não foi possível carregar o histórico.</p>
            <button
              type="button"
              onClick={loadHistory}
              className="flex items-center gap-2 rounded-xl bg-[#F28C28] px-4 py-2 font-semibold text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Tentar novamente
            </button>
          </div>
        )}

        {isEmpty && (
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p>Nenhuma mensagem foi reproduzida ainda.</p>
          </div>
        )}

        {actionError && (
          <div role="alert" className="rounded-2xl bg-white p-4 text-sm shadow-sm">
            {actionError}
          </div>
        )}

        {hasItems && (
          <>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              disabled={clearing || playingId !== null}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#5C3A21] bg-white px-4 py-2 font-semibold disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Limpar histórico
            </button>

            <ul className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto pr-1">
              {items.map((item) => {
                const isPlaying = playingId === item.id;
                return (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm"
                  >
                    <div className="min-w-0">
                      <p className="break-words text-lg font-medium">{item.text}</p>
                      <p className="text-sm opacity-75">{formatDateTime(item.createdAt)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePlay(item)}
                      disabled={playingId !== null}
                      aria-label={`Reproduzir novamente: ${item.text}`}
                      className="flex shrink-0 items-center gap-2 rounded-xl bg-[#F28C28] px-3 py-2 font-semibold text-white disabled:opacity-60"
                    >
                      <Volume2 className="h-5 w-5" />
                      {isPlaying ? "Reproduzindo" : "Reproduzir"}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-clear-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 text-[#5C3A21] shadow-lg"
          >
            <h2 id="confirm-clear-title" className="text-xl font-bold">
              Limpar histórico?
            </h2>
            <p className="mt-2">Todos os registros serão apagados permanentemente.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={clearing}
                className="rounded-xl border border-[#5C3A21] px-4 py-2"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmClear}
                disabled={clearing}
                className="rounded-xl bg-[#F28C28] px-4 py-2 font-semibold text-white disabled:opacity-60"
              >
                {clearing ? "Limpando..." : "Limpar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
