import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle,
  ShieldAlert,
  Loader2,
} from "lucide-react";

import EmergencyPhraseForm from "../../components/emergency/EmergencyPhraseForm";
import PinAccessPage from "../../components/profile/PinAccessPage";
import { useProfileContext } from "../../contexts/ProfileContext";
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
    setEnteredPin,
    setIsPinVerified,
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
      setLoadingPhrases(true);

      try {
        const data = await getEmergencyPhrases();

        if (active) {
          setPhrases(data);
          setError("");
        }
      } catch (err) {
        console.error("Erro ao carregar frases de emergência:", err);

        if (active) {
          setError("Não foi possível carregar as frases de emergência.");
        }
      } finally {
        if (active) {
          setLoadingPhrases(false);
        }
      }
    }

    void loadPhrases();

    return () => {
      active = false;
    };
  }, [loading, user, needsPin]);

  // Controla o fechamento do modal de exclusão.
  useEffect(() => {
    if (!phraseToDelete) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !saving) {
        event.preventDefault();
        setPhraseToDelete(null);
        setError("");
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [phraseToDelete, saving]);

  function handleBack() {
    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");

    navigate("/emergencia", { replace: true });
  }

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

  function closeForm() {
    if (saving) return;

    setFormOpen(false);
    setEditingPhrase(null);
    setError("");
  }

  function closeDeleteConfirmation() {
    if (saving) return;

    setPhraseToDelete(null);
    setError("");
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
    } catch (err) {
      console.error("Erro ao salvar frase de emergência:", err);

      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user || needsPin || !phraseToDelete || saving) return;

    const phrase = phraseToDelete;

    setSaving(true);
    setError("");

    try {
      await deleteEmergencyPhrase(phrase.id);

      setPhrases((current) => current.filter((item) => item.id !== phrase.id));

      setPhraseToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir frase de emergência:", err);

      setError(
        err instanceof Error &&
          err.message ===
            "É necessário manter pelo menos uma frase de emergência cadastrada."
          ? err.message
          : "Não foi possível excluir a frase.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading || !user) return null;

  // Mantém o padrão de verificação de PIN das outras telas.
  if (needsPin) {
    return <PinAccessPage title="Gerenciar Emergência" onBack={handleBack} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      {/* Decoração do fundo */}
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
              aria-label="Voltar para Emergência"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm transition-transform active:scale-95"
            >
              <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
            </button>

            <h1 className="min-w-0 text-xl font-extrabold leading-tight tracking-tight text-[#42251D] sm:text-2xl">
              Gerenciar Emergência
            </h1>
          </div>
        </header>

        {/* Apresentação */}
        <section className="mb-5 flex items-center gap-3 rounded-3xl bg-[#FBE0D8] p-4">
          <span
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70"
          >
            <ShieldAlert size={30} strokeWidth={2.3} color="#A52E24" />
          </span>

          <div className="min-w-0">
            <h2 className="font-extrabold text-[#42251D]">
              Mensagens de emergência
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-[#775A49]">
              Organize as mensagens que ajudam a criança a pedir ajuda
              rapidamente.
            </p>
          </div>
        </section>

        {/* Lista de frases */}
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
              onClick={openCreateForm}
              className="flex min-h-11 items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white transition-transform active:scale-95"
            >
              <Plus size={19} aria-hidden="true" />
              Nova frase
            </button>
          </div>

          {error && !phraseToDelete && (
            <p
              role="alert"
              className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          {loadingPhrases ? (
            <p className="text-sm text-app-muted">
              Carregando frases de emergência...
            </p>
          ) : phrases.length === 0 ? (
            <div className="rounded-2xl bg-[#FFF9F3] p-6 text-center">
              <ShieldAlert
                size={42}
                className="mx-auto mb-3 text-[#A52E24]"
                aria-hidden="true"
              />

              <p className="font-bold text-[#42251D]">
                Nenhuma frase cadastrada
              </p>

              <p className="mt-2 text-sm leading-relaxed text-[#80685D]">
                Toque em Nova frase para cadastrar uma mensagem de emergência.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {phrases.map((phrase) => {
                const selectedIcon = quickPhraseIcons.find(
                  (item) => item.id === phrase.icon,
                );

                const Icon = selectedIcon?.Icon ?? AlertTriangle;

                return (
                  <li
                    key={phrase.id}
                    className="rounded-2xl border border-[#F1E4D9] bg-[#FFFCF9] p-3 sm:p-4"
                  >
                    <div className="flex items-center gap-3">
                      {/* Ícone da frase */}
                      <span
                        aria-hidden="true"
                        className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F7C7BD]"
                      >
                        <Icon size={34} strokeWidth={2.2} color="#7C2D24" />
                      </span>

                      {/* Texto da frase */}
                      <div className="min-w-0 flex-1">
                        <h3 className="break-words font-extrabold text-[#42251D]">
                          {phrase.text}
                        </h3>

                        <p className="mt-1 break-words text-sm leading-relaxed text-[#80685D]">
                          {phrase.speechText}
                        </p>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="mt-3 flex justify-end gap-2 border-t border-[#F1E4D9] pt-3">
                      <button
                        type="button"
                        onClick={() => openEditForm(phrase)}
                        aria-label={`Editar frase ${phrase.text}`}
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F5F0EA] px-3 py-2 text-sm font-semibold text-[#42251D] transition-colors hover:bg-[#EEE4DB]"
                      >
                        <Pencil size={17} aria-hidden="true" />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          setPhraseToDelete(phrase);
                        }}
                        disabled={phrases.length <= 1}
                        aria-label={`Excluir frase ${phrase.text}`}
                        title={
                          phrases.length <= 1
                            ? "É necessário manter pelo menos uma frase de emergência."
                            : undefined
                        }
                        className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 transition-colors active:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={17} aria-hidden="true" />
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
            className="mt-6 min-h-12 w-full rounded-xl bg-brand-primary px-4 py-3 font-bold text-white transition-colors hover:bg-brand-hover"
          >
            Confirmar
          </button>
        </section>
      </div>

      {!loadingPhrases && phrases.length === 1 && (
        <p
          role="status"
          className="mb-4 rounded-2xl border border-[#F4D4BD] bg-[#FFF7F0] px-4 py-3 text-sm leading-6 text-[#80685D]"
        >
          Para garantir o acesso à comunicação de emergência, é necessário
          manter pelo menos uma frase cadastrada.
        </p>
      )}

      {/* Formulário de cadastro e edição */}
      {formOpen && (
        <EmergencyPhraseForm
          key={editingPhrase?.id ?? "new-emergency-phrase"}
          initialPhrase={editingPhrase ?? undefined}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}

      {/* Modal de confirmação de exclusão */}
      {phraseToDelete &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
            {/* Fundo escurecido: tocar fora cancela a exclusão */}
            <button
              type="button"
              aria-label="Cancelar exclusão e fechar janela"
              onClick={closeDeleteConfirmation}
              disabled={saving}
              className="absolute inset-0 h-full w-full bg-[#26160E]/60 backdrop-blur-[2px]"
            />

            <div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-emergency-title"
              aria-describedby="delete-emergency-description"
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
                  id="delete-emergency-title"
                  className="text-lg font-extrabold text-[#42251D]"
                >
                  Excluir frase?
                </h2>
              </div>

              <p
                id="delete-emergency-description"
                className="mt-4 text-sm leading-6 text-[#80685D]"
              >
                Deseja excluir a frase{" "}
                <strong className="break-words text-[#42251D]">
                  "{phraseToDelete.text}"
                </strong>
                ? Esta ação não pode ser desfeita.
              </p>

              {error && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl border border-[#F4D4BD] bg-[#FFF0E4] p-3 text-sm text-[#9A3412]"
                >
                  {error}
                </p>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeDeleteConfirmation}
                  disabled={saving}
                  autoFocus
                  className="flex min-h-12 min-w-0 items-center justify-center rounded-2xl border border-[#F1E4D9] bg-white px-3 text-sm font-bold text-[#42251D] transition-colors active:bg-[#FFF0E4] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={() => void handleDelete()}
                  disabled={saving}
                  className="flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-2xl bg-brand-primary px-3 text-sm font-bold text-white transition-colors active:bg-[#9A3412] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-brand-primary"
                >
                  {saving ? (
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
