import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";

import {
  AlertTriangle,
  ArrowLeft,
  AudioLines,
  Loader2,
  RotateCcw,
  Trash2,
  Volume2,
} from "lucide-react";

import AppIcon from "../../components/common/AppIcon";
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
  const navigate = useNavigate();

  const [items, setItems] = useState<HistoryItem[]>([]);
  const [status, setStatus] = useState<LoadStatus>("loading");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const loadHistory = useCallback(async (silent = false) => {
    if (!silent) {
      setStatus("loading");
    }

    try {
      const data = await getHistory();

      setItems(data);
      setStatus("ready");
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);

      if (silent) {
        setActionError("Não foi possível atualizar o histórico.");
      } else {
        setStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  function handlePlay(item: HistoryItem): void {
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
          setActionError("Não foi possível reproduzir esta mensagem.");

          return;
        }

        // A reprodução cria um novo registro no histórico.
        // Atualizamos a lista sem mostrar o carregamento.

        void loadHistory(true);
      },
    );
  }

  async function handleConfirmClear(): Promise<void> {
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
    <main className="relative min-h-dvh overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4 md:px-6 md:pt-6 lg:landscape:pb-8 xl:px-8 xl:pb-8 xl:pt-8">
      {" "}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-80 h-44 w-44 rounded-full bg-[#FFF0BB]/30"
      />
      <div className="relative mx-auto w-full max-w-lg md:max-w-3xl lg:max-w-4xl">
        {/* Cabeçalho */}

        <header className="mb-6 pt-3">
          <div className="relative flex min-h-14 items-center justify-center">
            <button
              type="button"
              onClick={() => navigate("/perfil")}
              aria-label="Voltar para o perfil"
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
            </button>

            <h1 className="px-14 text-center text-2xl font-extrabold tracking-tight text-[#42251D]">
              Histórico
            </h1>
          </div>
        </header>

        {/* Carregamento */}

        {status === "loading" && (
          <div
            role="status"
            className="flex items-center justify-center gap-3 rounded-3xl border border-[#F5E9DF] bg-white p-6 text-[#80685D] shadow-sm"
          >
            <Loader2
              size={22}
              className="animate-spin text-brand-primary"
              aria-hidden="true"
            />

            <span className="text-sm font-medium">Carregando histórico...</span>
          </div>
        )}

        {/* Erro de carregamento */}

        {status === "error" && (
          <div
            role="alert"
            className="rounded-3xl border border-[#F5E9DF] bg-white px-5 py-8 text-center shadow-sm"
          >
            <span
              aria-hidden="true"
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF0E4] text-brand-primary"
            >
              <AlertTriangle size={30} />
            </span>

            <p className="mt-4 font-bold text-[#42251D]">
              Não foi possível carregar o histórico
            </p>

            <p className="mt-2 text-sm text-[#80685D]">
              Verifique e tente novamente.
            </p>

            <button
              type="button"
              onClick={() => void loadHistory()}
              className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 font-bold text-white active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <RotateCcw size={19} aria-hidden="true" />
              Tentar novamente
            </button>
          </div>
        )}

        {actionError && (
          <p
            role="alert"
            className="mb-4 rounded-2xl border border-[#F4D4BD] bg-[#FFF0E4] p-4 text-sm font-medium text-[#9A3412]"
          >
            {actionError}
          </p>
        )}

        {/* Histórico de mensagens */}

        {status === "ready" && (
          <section aria-labelledby="history-list-title">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFE0BD]"
                >
                  <AppIcon name="History" size={48} />
                </span>

                <div>
                  <h2
                    id="history-list-title"
                    className="text-lg font-extrabold text-[#42251D]"
                  >
                    Mensagens faladas
                  </h2>

                  <p className="text-xs text-[#80685D]">
                    {items.length}{" "}
                    {items.length === 1 ? "registro" : "registros"}
                  </p>
                </div>
              </div>

              {hasItems && (
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  disabled={clearing || playingId !== null}
                  className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-[#A1442D] transition-colors active:bg-[#FFF0E4] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  <Trash2 size={18} aria-hidden="true" />
                  Limpar
                </button>
              )}
            </div>

            {/* Histórico vazio */}

            {isEmpty ? (
              <div className="rounded-3xl border border-[#F5E9DF] bg-white p-5 shadow-[0_5px_14px_rgba(41,37,36,0.06)]">
                <div className="flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0E4]"
                  >
                    <AppIcon name="History" size={72} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-[#42251D]">
                      Seu histórico está vazio
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-[#80685D]">
                      Suas mensagens faladas aparecerão aqui.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/mensagem")}
                  className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#FFF0E4] px-4 text-sm font-bold text-brand-primary transition-colors active:bg-[#FFE0BD] focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  Montar uma frase
                  <ArrowLeft
                    size={18}
                    className="rotate-180"
                    aria-hidden="true"
                  />
                </button>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {items.map((item) => {
                  const isPlaying = playingId === item.id;

                  return (
                    <li
                      key={item.id}
                      className={`flex min-h-[88px] items-center gap-3 rounded-3xl border bg-white p-4 shadow-[0_5px_14px_rgba(41,37,36,0.06)] ${
                        isPlaying ? "border-[#F1BC93]" : "border-[#F5E9DF]"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-base font-bold leading-6 text-[#42251D]">
                          {item.text}
                        </p>

                        <time
                          dateTime={new Date(item.createdAt).toISOString()}
                          className="mt-1.5 block text-xs font-medium text-[#9A8276]"
                        >
                          {formatDateTime(item.createdAt)}
                        </time>
                      </div>

                      <button
                        type="button"
                        onClick={() => handlePlay(item)}
                        disabled={playingId !== null}
                        aria-label={
                          isPlaying
                            ? `Reproduzindo: ${item.text}`
                            : `Reproduzir: ${item.text}`
                        }
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-sm transition-transform active:scale-95 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
                          isPlaying ? "bg-[#9A3412]" : "bg-brand-primary"
                        }`}
                      >
                        {isPlaying ? (
                          <AudioLines
                            size={24}
                            className="animate-pulse"
                            aria-hidden="true"
                          />
                        ) : (
                          <Volume2
                            size={24}
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        )}
      </div>
      {/* Confirmação de exclusão */}
      {confirmOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
            <button
              type="button"
              aria-label="Cancelar exclusão e fechar janela"
              onClick={() => setConfirmOpen(false)}
              disabled={clearing}
              className="absolute inset-0 h-full w-full bg-[#26160E]/60 backdrop-blur-[2px]"
            />

            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-clear-title"
              aria-describedby="confirm-clear-description"
              className="relative z-10 w-full max-w-[360px] rounded-3xl border border-[#F5E9DF] bg-white p-5 shadow-[0_24px_60px_rgba(38,22,14,0.25)]"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF0E4] text-brand-primary"
                >
                  <Trash2 size={23} strokeWidth={2.2} />
                </span>

                <h2
                  id="confirm-clear-title"
                  className="text-lg font-extrabold text-[#42251D]"
                >
                  Limpar histórico?
                </h2>
              </div>

              <p
                id="confirm-clear-description"
                className="mt-4 text-sm leading-6 text-[#80685D]"
              >
                Todas as mensagens do histórico serão apagadas. Esta ação não
                pode ser desfeita.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  disabled={clearing}
                  autoFocus
                  className="flex min-h-12 min-w-0 items-center justify-center rounded-2xl border border-[#F1E4D9] bg-white px-3 text-sm font-bold text-[#42251D] active:bg-[#FFF0E4] disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => void handleConfirmClear()}
                  disabled={clearing}
                  className="flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-2xl bg-brand-primary px-3 text-sm font-bold text-white active:bg-[#9A3412] disabled:opacity-50"
                >
                  {clearing ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Limpando
                    </>
                  ) : (
                    <>
                      <Trash2 size={17} aria-hidden="true" />
                      Apagar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </main>
  );
}
