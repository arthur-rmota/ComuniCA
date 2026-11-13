import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Pencil } from "lucide-react";
import { useNavigate } from "react-router";
import { useProfileContext } from "../contexts/ProfileContext";
import { PinVerificationForm } from "../components/profile/PinVerificationForm";
import { quickPhraseIcons } from "../constants/quickPhraseIcons";
import {
  getQuickPhrases,
  createQuickPhrase,
  updateQuickPhrase,
  deleteQuickPhrase,
} from "../services/quickPhraseService";
import {
  getQuickPhraseFavorites,
  removeQuickPhraseFavorite,
} from "../services/quickPhraseFavoriteService";
import type { QuickPhrase } from "../types/quickPhrase";
import QuickPhraseForm from "../components/quickPhrases/QuickPhraseForm";

export default function ManageQuickPhrasesPage() {
  const navigate = useNavigate();

  const [phrases, setPhrases] = useState<QuickPhrase[]>([]);
  const [isAddPhraseOpen, setIsAddPhraseOpen] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState<QuickPhrase | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isDeletingPhrase, setIsDeletingPhrase] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [phrasesLoading, setPhrasesLoading] = useState(true);
  const [phrasesError, setPhrasesError] = useState("");

  const {
    user,
    loading,
    isPinVerified,
    setIsPinVerified,
    enteredPin,
    setEnteredPin,
    verifyingPin,
    accessPinError,
    setAccessPinError,
    handleVerifyPin,
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
      try {
        const data = await getQuickPhrases();

        if (active) {
          setPhrases(data);
          setPhrasesError("");
        }
      } catch (error) {
        console.error("Erro ao carregar frases rápidas:", error);

        if (active) {
          setPhrasesError("Não foi possível carregar as frases rápidas.");
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

  async function handleSavePhrase(
    phrase: Omit<QuickPhrase, "id">,
  ): Promise<void> {
    if (needsPin || !user) {
      throw new Error("Acesso não autorizado.");
    }

    const nextPosition =
      Math.max(0, ...phrases.map((item) => item.position)) + 1;

    const newPhrase = await createQuickPhrase({
      ...phrase,
      position: nextPosition,
    });

    setPhrases((currentPhrases) => [...currentPhrases, newPhrase]);
  }

  async function handleUpdatePhrase(
    id: string,
    changes: Omit<QuickPhrase, "id">,
  ): Promise<void> {
    if (needsPin || !user) {
      throw new Error("Acesso não autorizado.");
    }

    const originalPhrase = phrases.find((phrase) => phrase.id === id);

    if (!originalPhrase || originalPhrase.userId !== "local-user") {
      throw new Error("Somente frases personalizadas podem ser editadas.");
    }

    const updatedPhrase = await updateQuickPhrase(id, changes);

    setPhrases((currentPhrases) =>
      currentPhrases.map((phrase) =>
        phrase.id === id ? updatedPhrase : phrase,
      ),
    );
  }

  async function handleDeletePhrase(id: string): Promise<void> {
    if (needsPin || !user) {
      throw new Error("Acesso não autorizado.");
    }

    const phrase = phrases.find((item) => item.id === id);

    if (!phrase || phrase.userId !== "local-user") {
      throw new Error("Somente frases personalizadas podem ser excluídas.");
    }

    const favorites = await getQuickPhraseFavorites("local-user");

    const relatedFavorites = favorites.filter(
      (favorite) => favorite.quickPhraseId === id,
    );

    for (const favorite of relatedFavorites) {
      await removeQuickPhraseFavorite(favorite.id);
    }

    await deleteQuickPhrase(id);

    setPhrases((currentPhrases) =>
      currentPhrases.filter((item) => item.id !== id),
    );

    setEditingPhrase(null);
    setIsDeleteConfirmationOpen(false);
  }

  function handleBack() {
    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");
    navigate("/rapidos", { replace: true });
  }

  if (loading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="relative flex items-center justify-center py-6">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Voltar para frases rápidas"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <ArrowLeft size={22} color="#383838" />
        </button>

        <h1 className="text-xl font-semibold text-app-text">
          Gerenciar frases rápidas
        </h1>
      </header>

      <section className="mt-4 rounded-2xl bg-white p-5">
        {needsPin ? (
          <>
            <h2 className="mb-4 text-lg font-semibold text-app-text">
              Verificar PIN de acesso
            </h2>

            <PinVerificationForm
              enteredPin={enteredPin}
              accessPinError={accessPinError}
              verifyingPin={verifyingPin}
              onPinChange={setEnteredPin}
              onSubmit={handleVerifyPin}
              onCancel={handleBack}
              onForgotPin={() => navigate("/perfil/recuperar-pin")}
            />
          </>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-app-text">
                Frases cadastradas
              </h2>

              <button
                type="button"
                onClick={() => setIsAddPhraseOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-brand-primary hover:bg-brand-hover transition-colors px-3 py-2 text-sm font-semibold text-white"
              >
                <Plus size={18} />
                Nova frase
              </button>
            </div>

            {phrasesLoading ? (
              <p className="text-sm text-gray-600">Carregando frases...</p>
            ) : phrasesError ? (
              <p role="alert" className="text-sm text-red-600">
                {phrasesError}
              </p>
            ) : phrases.length === 0 ? (
              <p className="text-sm text-gray-600">Nenhuma frase cadastrada.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {phrases.map((phrase) => {
                  const selectedIcon = quickPhraseIcons.find(
                    (item) => item.id === phrase.icon,
                  );

                  const Icon = selectedIcon?.Icon;

                  const isCustom = phrase.userId === "local-user";

                  return (
                    <li
                      key={phrase.id}
                      className="rounded-xl border border-app-border bg-white p-3 sm:p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                          style={{ backgroundColor: phrase.color }}
                        >
                          {Icon && (
                            <Icon
                              size={28}
                              color="#383838"
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words font-semibold text-app-text">
                            {phrase.text}
                          </h3>

                          <p className="mt-1 text-xs text-app-muted">
                            {isCustom
                              ? "Frase personalizada"
                              : "Frase predefinida"}
                          </p>
                        </div>
                      </div>

                      {isCustom && (
                        <div className="mt-3 flex justify-end border-t border-app-border pt-3">
                          <button
                            type="button"
                            onClick={() => setEditingPhrase(phrase)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-2 text-sm font-medium text-app-text transition-colors hover:bg-stone-200"
                          >
                            <Pencil size={16} aria-hidden="true" />
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
              className="mt-6 w-full rounded-xl bg-brand-primary hover:bg-brand-hover transition-colors px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Confirmar
            </button>
          </>
        )}
      </section>
      {!needsPin && isAddPhraseOpen && (
        <QuickPhraseForm
          onClose={() => setIsAddPhraseOpen(false)}
          onSave={handleSavePhrase}
        />
      )}
      {!needsPin && editingPhrase && (
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
      {!needsPin && isDeleteConfirmationOpen && editingPhrase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-phrase-title"
            aria-describedby="delete-phrase-description"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2
              id="delete-phrase-title"
              className="text-xl font-bold text-app-text"
            >
              Excluir frase?
            </h2>

            <p
              id="delete-phrase-description"
              className="mt-3 text-sm text-gray-600"
            >
              Tem certeza de que deseja excluir a frase{" "}
              <strong>"{editingPhrase.text}"</strong>? Esta ação não poderá ser
              desfeita.
            </p>

            {deleteError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {deleteError}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={isDeletingPhrase}
                onClick={() => setIsDeleteConfirmationOpen(false)}
                className="flex-1 rounded-xl bg-stone-100 px-4 py-3 font-semibold text-app-text"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={isDeletingPhrase}
                onClick={async () => {
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
                }}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
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
