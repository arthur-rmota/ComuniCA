import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";

import { ArrowLeft, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import AppIcon from "../../components/common/AppIcon";
import { useProfileContext } from "../../contexts/ProfileContext";
import PinAccessPage from "../../components/profile/PinAccessPage";
import QuickPhraseForm from "../../components/quickPhrases/QuickPhraseForm";

import {
  getQuickPhrases,
  createQuickPhrase,
  updateQuickPhrase,
  deleteQuickPhrase,
} from "../../services/quickPhraseService";

import type { QuickPhrase } from "../../types/quickPhrase";

export default function ManageQuickPhrasesPage() {
  const navigate = useNavigate();

  const [phrases, setPhrases] = useState<QuickPhrase[]>([]);
  const [phrasesLoading, setPhrasesLoading] = useState(true);
  const [phrasesError, setPhrasesError] = useState("");

  const [isAddPhraseOpen, setIsAddPhraseOpen] = useState(false);

  const [editingPhrase, setEditingPhrase] = useState<QuickPhrase | null>(null);

  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);

  const [isDeletingPhrase, setIsDeletingPhrase] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const {
    user,
    loading,
    isPinVerified,
    setIsPinVerified,
    setEnteredPin,
    setAccessPinError,
  } = useProfileContext();

  const needsPin = Boolean(user?.pinHash && !isPinVerified);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/perfil", { replace: true });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (loading || !user || needsPin) return;

    let active = true;

    async function loadPhrases() {
      setPhrasesLoading(true);

      try {
        const data = await getQuickPhrases();

        if (active) {
          setPhrases(data);
          setPhrasesError("");
        }
      } catch (error) {
        console.error("Erro ao carregar frases:", error);

        if (active) {
          setPhrasesError("Não foi possível carregar as frases cadastradas.");
        }
      } finally {
        if (active) {
          setPhrasesLoading(false);
        }
      }
    }

    void loadPhrases();

    return () => {
      active = false;
    };
  }, [loading, user, needsPin]);

  // Bloqueia a rolagem durante a confirmação de exclusão.

  useEffect(() => {
    if (!isDeleteConfirmationOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !isDeletingPhrase) {
        event.preventDefault();
        event.stopPropagation();

        setIsDeleteConfirmationOpen(false);
        setDeleteError("");
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isDeleteConfirmationOpen, isDeletingPhrase]);

  function handleBack() {
    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");

    navigate("/rapidos", { replace: true });
  }

  async function handleSavePhrase(
    phrase: Omit<QuickPhrase, "id">,
  ): Promise<void> {
    if (!user || needsPin) {
      throw new Error("Acesso não autorizado.");
    }

    const nextPosition =
      Math.max(0, ...phrases.map((item) => item.position)) + 1;

    const newPhrase = await createQuickPhrase({
      ...phrase,
      position: nextPosition,
    });

    setPhrases((current) => [...current, newPhrase]);
    setPhrasesError("");
  }

  async function handleUpdatePhrase(
    id: string,
    changes: Omit<QuickPhrase, "id">,
  ): Promise<void> {
    if (!user || needsPin) {
      throw new Error("Acesso não autorizado.");
    }

    const originalPhrase = phrases.find((phrase) => phrase.id === id);

    if (!originalPhrase) {
      throw new Error("Frase não encontrada.");
    }

    const updatedPhrase = await updateQuickPhrase(id, changes);

    setPhrases((current) =>
      current.map((phrase) => (phrase.id === id ? updatedPhrase : phrase)),
    );
  }

  async function handleDeletePhrase(id: string): Promise<void> {
    if (!user || needsPin) {
      throw new Error("Acesso não autorizado.");
    }

    const phrase = phrases.find((item) => item.id === id);

    if (!phrase) {
      throw new Error("Frase não encontrada.");
    }

    await deleteQuickPhrase(id);

    setPhrases((current) => current.filter((item) => item.id !== id));

    setEditingPhrase(null);
    setIsDeleteConfirmationOpen(false);
  }

  async function confirmDeletePhrase() {
    if (!editingPhrase || isDeletingPhrase) return;

    setIsDeletingPhrase(true);
    setDeleteError("");

    try {
      await handleDeletePhrase(editingPhrase.id);
    } catch (error) {
      console.error("Erro ao excluir frase:", error);

      setDeleteError("Não foi possível excluir a frase.");
    } finally {
      setIsDeletingPhrase(false);
    }
  }

  if (loading || !user) return null;

  if (needsPin) {
    return (
      <PinAccessPage title="Gerenciar Minhas Frases" onBack={handleBack} />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      {/* Decoração */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-96 h-48 w-48 rounded-full bg-[#FFF0BB]/30"
      />

      <div className="relative mx-auto w-full max-w-lg">
        {/* Cabeçalho */}

        <header className="mb-6 pt-3">
          <div className="flex min-h-14 items-center gap-4">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Voltar para Minhas Frases"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm transition-transform active:scale-95"
            >
              <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
            </button>

            <h1 className="min-w-0 text-xl font-extrabold leading-tight tracking-tight text-[#42251D] sm:text-2xl">
              Gerenciar Minhas Frases
            </h1>
          </div>
        </header>

        {/* Apresentação */}

        <section className="mb-5 flex items-center gap-3 rounded-3xl bg-[#FFE0BD] p-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70"
          >
            <AppIcon name="MessagesSquare" size={48} />
          </span>

          <div className="min-w-0">
            <h2 className="font-extrabold text-[#42251D]">
              Personalize suas frases
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-[#775A49]">
              Cadastre mensagens para facilitar a comunicação no dia a dia.
            </p>
          </div>
        </section>

        {/* Frases cadastradas */}

        <section className="rounded-3xl border border-[#F5E9DF] bg-white p-4 shadow-[0_5px_14px_rgba(41,37,36,0.06)] sm:p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-extrabold text-[#42251D]">
                Frases cadastradas
              </h2>

              <p className="mt-1 text-xs font-medium text-[#80685D]">
                {phrases.length} frase(s)
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddPhraseOpen(true)}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white transition-transform active:scale-95"
            >
              <Plus size={19} aria-hidden="true" />
              Nova frase
            </button>
          </div>

          {phrasesError && (
            <p
              role="alert"
              className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {phrasesError}
            </p>
          )}

          {phrasesLoading ? (
            <p className="text-sm text-app-muted">Carregando frases...</p>
          ) : phrases.length === 0 ? (
            <div className="rounded-2xl bg-[#FFF9F3] p-6 text-center">
              <AppIcon
                name="MessagesSquare"
                size={64}
                className="mx-auto mb-3"
              />

              <p className="font-bold text-[#42251D]">
                Nenhuma frase cadastrada
              </p>

              <p className="mt-2 text-sm leading-relaxed text-[#80685D]">
                Toque em Nova frase para cadastrar uma mensagem.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {phrases.map((phrase) => {
                const isCustom = phrase.userId === "local-user";

                return (
                  <li
                    key={phrase.id}
                    className="rounded-2xl border border-[#F1E4D9] bg-[#FFFCF9] p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: phrase.color,
                        }}
                      >
                        <AppIcon
                          name={phrase.icon || "MessageCircle"}
                          size={72}
                        />
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-extrabold text-[#42251D]">
                          {phrase.text}
                        </h3>

                        <span
                          className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                            isCustom
                              ? "bg-[#DDEFE3] text-[#347854]"
                              : "bg-[#F5EDE6] text-[#775A49]"
                          }`}
                        >
                          {isCustom ? "Personalizada" : "Predefinida"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end border-t border-[#F1E4D9] pt-3">
                      <button
                        type="button"
                        onClick={() => setEditingPhrase(phrase)}
                        aria-label={`Editar frase ${phrase.text}`}
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F5F0EA] px-4 py-2 text-sm font-semibold text-[#42251D] transition-colors hover:bg-[#EEE4DB]"
                      >
                        <Pencil size={17} aria-hidden="true" />
                        Editar
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <button
            type="button"
            onClick={handleBack}
            className="mt-6 min-h-12 w-full rounded-xl bg-brand-primary px-4 py-3 font-bold text-white transition-colors hover:bg-brand-hover"
          >
            Confirmar
          </button>
        </section>
      </div>

      {/* Formulário de cadastro */}

      {isAddPhraseOpen && (
        <QuickPhraseForm
          onClose={() => setIsAddPhraseOpen(false)}
          onSave={handleSavePhrase}
        />
      )}

      {/* Formulário de edição */}

      {editingPhrase && (
        <QuickPhraseForm
          key={editingPhrase.id}
          initialPhrase={editingPhrase}
          onClose={() => setEditingPhrase(null)}
          onSave={async (changes) => {
            await handleUpdatePhrase(editingPhrase.id, changes);
          }}
          onDelete={() => {
            setDeleteError("");
            setIsDeleteConfirmationOpen(true);
          }}
        />
      )}

      {/* Confirmação de exclusão */}

      {isDeleteConfirmationOpen &&
        editingPhrase &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
            <button
              type="button"
              aria-label="Cancelar exclusão e fechar janela"
              onClick={() => {
                setIsDeleteConfirmationOpen(false);
                setDeleteError("");
              }}
              disabled={isDeletingPhrase}
              className="absolute inset-0 h-full w-full bg-[#26160E]/60 backdrop-blur-[2px]"
            />

            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-phrase-title"
              aria-describedby="delete-phrase-description"
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
                  id="delete-phrase-title"
                  className="text-lg font-extrabold text-[#42251D]"
                >
                  Excluir frase?
                </h2>
              </div>

              <p
                id="delete-phrase-description"
                className="mt-4 text-sm leading-6 text-[#80685D]"
              >
                Deseja excluir a frase{" "}
                <strong className="break-words text-[#42251D]">
                  "{editingPhrase.text}"
                </strong>
                ? Esta ação não pode ser desfeita.
              </p>

              {deleteError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-[#F4D4BD] bg-[#FFF0E4] p-3 text-sm text-[#9A3412]"
                >
                  {deleteError}
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsDeleteConfirmationOpen(false);
                    setDeleteError("");
                  }}
                  disabled={isDeletingPhrase}
                  autoFocus
                  className="flex min-h-12 min-w-0 items-center justify-center rounded-2xl border border-[#F1E4D9] bg-white px-3 text-sm font-bold text-[#42251D] transition-colors active:bg-[#FFF0E4] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => void confirmDeletePhrase()}
                  disabled={isDeletingPhrase}
                  className="flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-2xl bg-brand-primary px-3 text-sm font-bold text-white transition-colors active:bg-[#9A3412] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  {isDeletingPhrase ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                        aria-hidden="true"
                      />
                      Excluindo
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
