
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  MessageCircle,
  MessagesSquare,
  X,
} from "lucide-react";

import { useProfileContext } from "../../contexts/ProfileContext";
import PinAccessPage from "../../components/profile/PinAccessPage";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";
import QuickPhraseForm from "../../components/quickPhrases/QuickPhraseForm";

import {
  getQuickPhrases,
  createQuickPhrase,
  updateQuickPhrase,
  deleteQuickPhrase,
} from "../../services/quickPhraseService";

import {
  getQuickPhraseFavorites,
  removeQuickPhraseFavorite,
} from "../../services/quickPhraseFavoriteService";

import type { QuickPhrase } from "../../types/quickPhrase";

export default function ManageQuickPhrasesPage() {
  const navigate = useNavigate();

  const [phrases, setPhrases] = useState<QuickPhrase[]>([]);
  const [phrasesLoading, setPhrasesLoading] = useState(true);
  const [phrasesError, setPhrasesError] = useState("");

  const [isAddPhraseOpen, setIsAddPhraseOpen] = useState(false);
  const [editingPhrase, setEditingPhrase] =
    useState<QuickPhrase | null>(null);

  const [
    isDeleteConfirmationOpen,
    setIsDeleteConfirmationOpen,
  ] = useState(false);

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
          setPhrasesError(
            "Não foi possível carregar as frases cadastradas.",
          );
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

    const originalPhrase = phrases.find(
      (phrase) => phrase.id === id,
    );

    if (!originalPhrase || originalPhrase.userId !== "local-user") {
      throw new Error(
        "Somente frases personalizadas podem ser editadas.",
      );
    }

    const updatedPhrase = await updateQuickPhrase(id, changes);

    setPhrases((current) =>
      current.map((phrase) =>
        phrase.id === id ? updatedPhrase : phrase,
      ),
    );
  }

  async function handleDeletePhrase(id: string): Promise<void> {
    if (!user || needsPin) {
      throw new Error("Acesso não autorizado.");
    }

    const phrase = phrases.find((item) => item.id === id);

    if (!phrase || phrase.userId !== "local-user") {
      throw new Error(
        "Somente frases personalizadas podem ser excluídas.",
      );
    }

    const favorites = await getQuickPhraseFavorites("local-user");

    const relatedFavorites = favorites.filter(
      (favorite) => favorite.quickPhraseId === id,
    );

    for (const favorite of relatedFavorites) {
      await removeQuickPhraseFavorite(favorite.id);
    }

    await deleteQuickPhrase(id);

    setPhrases((current) =>
      current.filter((item) => item.id !== id),
    );

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
      <PinAccessPage
        title="Gerenciar Minhas Frases"
        onBack={handleBack}
      />
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
              <ArrowLeft
                size={24}
                strokeWidth={2.5}
                aria-hidden="true"
              />
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
            <MessagesSquare
              size={30}
              strokeWidth={2.3}
              color="#C2410C"
            />
          </span>

          <div className="min-w-0">
            <h2 className="font-extrabold text-[#42251D]">
              Personalize suas frases
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-[#775A49]">
              Cadastre mensagens para facilitar a comunicação
              no dia a dia.
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
            <p className="text-sm text-app-muted">
              Carregando frases...
            </p>
          ) : phrases.length === 0 ? (
            <div className="rounded-2xl bg-[#FFF9F3] p-6 text-center">
              <MessagesSquare
                size={42}
                className="mx-auto mb-3 text-brand-primary"
                aria-hidden="true"
              />

              <p className="font-bold text-[#42251D]">
                Nenhuma frase cadastrada
              </p>

              <p className="mt-2 text-sm leading-relaxed text-[#80685D]">
                Toque em Nova frase para cadastrar
                uma mensagem.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {phrases.map((phrase) => {
                const selectedIcon = quickPhraseIcons.find(
                  (item) => item.id === phrase.icon,
                );

                const Icon = selectedIcon?.Icon ?? MessageCircle;
                const isCustom = phrase.userId === "local-user";

                return (
                  <li
                    key={phrase.id}
                    className="rounded-2xl border border-[#F1E4D9] bg-[#FFFCF9] p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: phrase.color,
                        }}
                      >
                        <Icon
                          size={34}
                          strokeWidth={2.2}
                          color="#42251D"
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
                          {isCustom
                            ? "Personalizada"
                            : "Predefinida"}
                        </span>
                      </div>
                    </div>

                    {isCustom && (
                      <div className="mt-3 flex justify-end border-t border-[#F1E4D9] pt-3">
                        <button
                          type="button"
                          onClick={() => setEditingPhrase(phrase)}
                          aria-label={`Editar frase ${phrase.text}`}
                          className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F5F0EA] px-4 py-2 text-sm font-semibold text-[#42251D] transition-colors hover:bg-[#EEE4DB]"
                        >
                          <Pencil
                            size={17}
                            aria-hidden="true"
                          />
                          Editar
                        </button>
                      </div>
                    )}
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
      {isDeleteConfirmationOpen && editingPhrase && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/45 p-4"
          onClick={(event) => {
            if (
              event.target === event.currentTarget &&
              !isDeletingPhrase
            ) {
              setIsDeleteConfirmationOpen(false);
              setDeleteError("");
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-phrase-title"
            aria-describedby="delete-phrase-description"
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#F1E4D9] bg-[#FFF7F0] p-5">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100"
                >
                  <Trash2 size={24} color="#B91C1C" />
                </span>

                <h2
                  id="delete-phrase-title"
                  className="text-xl font-extrabold text-[#42251D]"
                >
                  Excluir frase?
                </h2>
              </div>

              <button
                type="button"
                disabled={isDeletingPhrase}
                onClick={() => {
                  setIsDeleteConfirmationOpen(false);
                  setDeleteError("");
                }}
                aria-label="Fechar confirmação"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#592B1D] disabled:opacity-50"
              >
                <X size={21} aria-hidden="true" />
              </button>
            </div>

            <div className="p-5">
              <p
                id="delete-phrase-description"
                className="text-sm leading-relaxed text-[#775F54]"
              >
                Deseja excluir a frase{" "}
                <strong className="text-[#42251D]">
                  "{editingPhrase.text}"
                </strong>
                ? Esta ação não poderá ser desfeita.
              </p>

              {deleteError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {deleteError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-[#F1E4D9] bg-white p-4">
              <button
                type="button"
                disabled={isDeletingPhrase}
                onClick={() => {
                  setIsDeleteConfirmationOpen(false);
                  setDeleteError("");
                }}
                className="min-h-12 rounded-xl border border-[#E7D5C8] bg-white px-3 py-3 font-semibold text-[#42251D] disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isDeletingPhrase}
                onClick={() => void confirmDeletePhrase()}
                className="min-h-12 rounded-xl bg-red-600 px-3 py-3 font-bold text-white disabled:opacity-50"
              >
                {isDeletingPhrase ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
