import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import EmergencyPhraseForm from "../../components/emergency/EmergencyPhraseForm";
import { useProfileContext } from "../../contexts/ProfileContext";
import { PinVerificationForm } from "../../components/profile/PinVerificationForm";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";
import {
  getEmergencyPhrases,
  createEmergencyPhrase,
  updateEmergencyPhrase,
  deleteEmergencyPhrase,
} from "../../services/emergencyPhraseService";
import type { EmergencyPhrase } from "../../types/emergencyPhrase";

export default function ManageEmergencyPhrasesPage() {
  const navigate = useNavigate();
  const [phrases, setPhrases] = useState<EmergencyPhrase[]>([]);
  const [loadingPhrases, setLoadingPhrases] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState<EmergencyPhrase | null>(
    null,
  );
  const [phraseToDelete, setPhraseToDelete] = useState<EmergencyPhrase | null>(
    null,
  );

  const {
    user,
    loading,
    isPinVerified,
    enteredPin,
    setEnteredPin,
    verifyingPin,
    accessPinError,
    handleVerifyPin,
    setIsPinVerified,
    setAccessPinError,
  } = useProfileContext();

  const needsPin = Boolean(user?.pinHash && !isPinVerified);

  function handleBack() {
    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");

    navigate("/emergencia", { replace: true });
  }

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
        const data = await getEmergencyPhrases();

        if (active) {
          setPhrases(data);
          setError("");
        }
      } catch (err) {
        console.error("Erro ao carregar emergências:", err);

        if (active) {
          setError("Não foi possível carregar as frases.");
        }
      } finally {
        if (active) setLoadingPhrases(false);
      }
    }

    void loadPhrases();

    return () => {
      active = false;
    };
  }, [loading, user, needsPin]);

  function openCreateForm() {
    setEditingPhrase(null);
    setError("");
    setFormOpen(true);
  }

  function openEditForm(phrase: EmergencyPhrase) {
    setEditingPhrase(phrase);
    setError("");
    setFormOpen(true);
  }

  async function handleSave(
    data: Pick<EmergencyPhrase, "text" | "speechText" | "icon">,
  ): Promise<void> {
    if (!user || needsPin || saving) {
      throw new Error("Operação não autorizada.");
    }

    setSaving(true);
    setError("");

    try {
      if (editingPhrase) {
        const updated = await updateEmergencyPhrase(editingPhrase.id, data);

        setPhrases((current) =>
          current.map((item) => (item.id === updated.id ? updated : item)),
        );
      } else {
        const nextPosition =
          Math.max(0, ...phrases.map((item) => item.position)) + 1;

        const created = await createEmergencyPhrase({
          ...data,
          position: nextPosition,
        });

        setPhrases((current) => [...current, created]);
      }

      setFormOpen(false);
      setEditingPhrase(null);
    } catch (error) {
      console.error("Erro ao salvar frase de emergência:", error);
      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user || needsPin || !phraseToDelete || saving) return;

    setSaving(true);
    setError("");

    try {
      await deleteEmergencyPhrase(phraseToDelete.id);

      setPhrases((current) =>
        current.filter((item) => item.id !== phraseToDelete.id),
      );

      setPhraseToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir emergência:", err);
      setError("Não foi possível excluir a frase.");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) return null;

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <button
        type="button"
        onClick={handleBack}
        className="mb-5 flex items-center gap-2 text-app-text"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <h1 className="mb-5 text-2xl font-bold text-app-text">
        Gerenciar emergências
      </h1>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
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
              onCancel={() => navigate("/emergencia")}
              onForgotPin={() => navigate("/perfil/recuperar-pin")}
            />
          </>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="font-semibold text-app-text">
                Frases de emergência
              </h2>

              <button
                type="button"
                onClick={openCreateForm}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-brand-primary px-3 py-2.5 text-sm font-semibold text-white"
              >
                <Plus size={18} />
                Nova frase
              </button>
            </div>

            {error && !formOpen && (
              <p role="alert" className="mb-4 text-sm text-red-600">
                {error}
              </p>
            )}

            {loadingPhrases ? (
              <p className="text-sm text-app-muted">Carregando frases...</p>
            ) : phrases.length === 0 ? (
              <p className="text-sm text-app-muted">
                Nenhuma frase de emergência cadastrada.
              </p>
            ) : (
              <ul className="space-y-3">
                {phrases.map((phrase) => {
                  const foundIcon = quickPhraseIcons.find(
                    (item) => item.id === phrase.icon,
                  );

                  const Icon = foundIcon?.Icon ?? AlertTriangle;

                  return (
                    <li
                      key={phrase.id}
                      className="rounded-xl border border-app-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F4C7AB]">
                          <Icon size={28} color="#7C2D12" aria-hidden="true" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words font-semibold text-app-text">
                            {phrase.text}
                          </h3>

                          <p className="mt-1 break-words text-sm text-app-muted">
                            {phrase.speechText}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end gap-2 border-t border-app-border pt-3">
                        <button
                          type="button"
                          onClick={() => openEditForm(phrase)}
                          className="flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm font-medium text-app-text"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setPhraseToDelete(phrase);
                          }}
                          className="flex items-center gap-2 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-700"
                        >
                          <Trash2 size={16} />
                          Excluir
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
              className="mt-6 w-full rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Confirmar
            </button>
          </>
        )}
      </section>

      {!needsPin && formOpen && (
        <EmergencyPhraseForm
          key={editingPhrase?.id ?? "new-emergency-phrase"}
          initialPhrase={editingPhrase ?? undefined}
          onClose={() => {
            setFormOpen(false);
            setEditingPhrase(null);
            setError("");
          }}
          onSave={handleSave}
        />
      )}

      {!needsPin && phraseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-emergency-title"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
          >
            <h2
              id="delete-emergency-title"
              className="text-xl font-bold text-app-text"
            >
              Excluir frase?
            </h2>

            <p className="my-4 text-sm text-app-muted">
              Deseja excluir "{phraseToDelete.text}"? Esta ação não poderá ser
              desfeita.
            </p>

            {error && (
              <p role="alert" className="mb-3 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => setPhraseToDelete(null)}
                className="flex-1 rounded-xl bg-stone-100 px-4 py-3 font-semibold text-app-text"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => void handleDelete()}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white disabled:opacity-50"
              >
                {saving ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
