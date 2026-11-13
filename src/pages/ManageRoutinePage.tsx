import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, CalendarCheck2, Pencil, Plus, Trash2 } from "lucide-react";

import { useProfileContext } from "../contexts/ProfileContext";
import { PinVerificationForm } from "../components/profile/PinVerificationForm";
import { quickPhraseIcons } from "../constants/quickPhraseIcons";
import { routineService } from "../services/routineService";

import type { RoutineSection } from "../types/routine";

const sectionColors = [
  "#DDEBFA",
  "#FFF0D6",
  "#DDEFE3",
  "#EBE1FA",
  "#F9D5D6",
  "#FFE5A3",
];

type SectionForm = Pick<
  RoutineSection,
  "name" | "description" | "icon" | "color"
>;

const emptyForm: SectionForm = {
  name: "",
  description: "",
  icon: "school",
  color: "#DDEBFA",
};

function ManageRoutinePage() {
  const navigate = useNavigate();

  const {
    user,
    loading: profileLoading,
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

  const [sections, setSections] = useState<RoutineSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<RoutineSection | null>(
    null,
  );
  const [sectionToDelete, setSectionToDelete] = useState<RoutineSection | null>(
    null,
  );

  const [form, setForm] = useState<SectionForm>(emptyForm);
  const [iconSearch, setIconSearch] = useState("");
  const [iconCategory, setIconCategory] = useState("Todas");

  useEffect(() => {
    if (!profileLoading && !user) {
      navigate("/perfil", { replace: true });
    }
  }, [profileLoading, user, navigate]);

  useEffect(() => {
    if (profileLoading || !user || needsPin) return;

    let active = true;

    async function loadSections() {
      try {
        const data = await routineService.getSections();

        if (active) {
          setSections(data);
          setError("");
        }
      } catch (err) {
        console.error("Erro ao carregar rotina:", err);

        if (active) {
          setError("Não foi possível carregar as seções.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSections();

    return () => {
      active = false;
    };
  }, [profileLoading, user, needsPin]);

  function handleBack() {
    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");
    navigate("/agenda", { replace: true });
  }

  function openCreateForm() {
    setEditingSection(null);
    setForm({ ...emptyForm });
    setIconSearch("");
    setIconCategory("Todas");
    setError("");
    setFormOpen(true);
  }

  function openEditForm(section: RoutineSection) {
    setEditingSection(section);
    setForm({
      name: section.name,
      description: section.description,
      icon: section.icon,
      color: section.color,
    });
    setIconSearch("");
    setIconCategory("Todas");
    setError("");
    setFormOpen(true);
  }

  async function handleSave(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || needsPin || saving) return;

    const name = form.name.trim();
    const description = form.description.trim();

    if (!name) {
      setError("Informe o nome da seção.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const data = {
        name,
        description,
        icon: form.icon,
        color: form.color,
      };

      if (editingSection) {
        await routineService.updateSection(editingSection.id, data);
      } else {
        const nextPosition =
          Math.max(0, ...sections.map((item) => item.position)) + 1;

        await routineService.createSection({
          ...data,
          position: nextPosition,
        });
      }

      const updatedSections = await routineService.getSections();
      setSections(updatedSections);
      setFormOpen(false);
      setEditingSection(null);
    } catch (err) {
      console.error("Erro ao salvar seção:", err);
      setError("Não foi possível salvar a seção.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user || needsPin || !sectionToDelete || saving) return;

    setSaving(true);
    setError("");

    try {
      const removed = await routineService.removeSection(sectionToDelete.id);

      if (!removed) {
        setSectionToDelete(null);
        setError(
          "Esta seção possui atividades. Exclua as atividades antes de remover a seção.",
        );
        return;
      }

      setSections((current) =>
        current.filter((item) => item.id !== sectionToDelete.id),
      );
      setSectionToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir seção:", err);
      setError("Não foi possível excluir a seção.");
    } finally {
      setSaving(false);
    }
  }

  const iconCategories = [
    "Todas",
    ...new Set(quickPhraseIcons.map((item) => item.category)),
  ];

  const filteredIcons = quickPhraseIcons.filter((item) => {
    const searchMatches = item.label
      .toLocaleLowerCase("pt-BR")
      .includes(iconSearch.trim().toLocaleLowerCase("pt-BR"));

    return (
      searchMatches &&
      (iconCategory === "Todas" || item.category === iconCategory)
    );
  });

  if (profileLoading || !user) return null;

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
        Gerenciar Rotina
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
              onCancel={handleBack}
              onForgotPin={() => navigate("/perfil/recuperar-pin")}
            />
          </>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="font-semibold text-app-text">Seções da rotina</h2>

              <button
                type="button"
                onClick={openCreateForm}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-brand-primary px-3 py-2.5 text-sm font-semibold text-white"
              >
                <Plus size={18} />
                Nova seção
              </button>
            </div>

            {error && (
              <p
                role="alert"
                className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {loading ? (
              <p className="text-sm text-app-muted">Carregando seções...</p>
            ) : sections.length === 0 ? (
              <p className="text-sm text-app-muted">
                Nenhuma seção cadastrada.
              </p>
            ) : (
              <ul className="space-y-3">
                {sections.map((section) => {
                  const selectedIcon = quickPhraseIcons.find(
                    (item) => item.id === section.icon,
                  );

                  const Icon = selectedIcon?.Icon ?? CalendarCheck2;

                  return (
                    <li
                      key={section.id}
                      className="rounded-xl border border-app-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: section.color,
                          }}
                        >
                          <Icon size={30} color="#292524" aria-hidden="true" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="break-words font-semibold text-app-text">
                            {section.name}
                          </h3>

                          {section.description && (
                            <p className="mt-1 break-words text-sm text-app-muted">
                              {section.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/rotina/gerenciar/${section.id}/atividades`)
                        }
                        className="mt-3 w-full rounded-xl bg-[#FFF3E0] px-4 py-3 text-sm font-semibold text-[#9A3412]"
                      >
                        Gerenciar atividades
                      </button>

                      <div className="mt-3 flex justify-end gap-2 border-t border-app-border pt-3">
                        <button
                          type="button"
                          onClick={() => openEditForm(section)}
                          className="flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm font-medium text-app-text"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setError("");
                            setSectionToDelete(section);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="routine-form-title"
            className="max-h-[90dvh] w-full max-w-md overflow-x-hidden overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6"
          >
            <h2
              id="routine-form-title"
              className="mb-4 text-xl font-bold text-app-text"
            >
              {editingSection ? "Editar seção" : "Nova seção"}
            </h2>

            <form
              onSubmit={(event) => void handleSave(event)}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="routine-name"
                  className="mb-2 block text-sm font-semibold text-app-text"
                >
                  Nome da seção
                </label>

                <input
                  id="routine-name"
                  required
                  maxLength={40}
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Ex.: Escola"
                  className="w-full rounded-xl border border-gray-300 p-3 text-base"
                />
              </div>

              <div>
                <label
                  htmlFor="routine-description"
                  className="mb-2 block text-sm font-semibold text-app-text"
                >
                  Descrição
                </label>

                <input
                  id="routine-description"
                  maxLength={100}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Ex.: Aulas e atividades"
                  className="w-full rounded-xl border border-gray-300 p-3 text-base"
                />
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-app-text">
                  Cor da seção
                </p>

                <div className="flex flex-wrap gap-3">
                  {sectionColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          color,
                        }))
                      }
                      aria-label={`Selecionar cor ${color}`}
                      aria-pressed={form.color === color}
                      className={`h-11 w-11 rounded-xl border-2 ${
                        form.color === color
                          ? "border-brand-primary ring-2 ring-orange-200"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold text-app-text">
                  Ícone da seção
                </p>

                <input
                  type="search"
                  value={iconSearch}
                  onChange={(event) => setIconSearch(event.target.value)}
                  placeholder="Pesquisar ícone..."
                  aria-label="Pesquisar ícones"
                  className="mb-3 w-full rounded-xl border border-gray-300 p-3 text-base"
                />

                <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
                  {iconCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setIconCategory(category)}
                      aria-pressed={iconCategory === category}
                      className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold ${
                        iconCategory === category
                          ? "border-[#FFA726] bg-[#FFF3E0] text-[#A86400]"
                          : "border-gray-200 bg-gray-50 text-app-text"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="max-h-52 overflow-y-auto rounded-xl border border-gray-200 p-2">
                  <div className="grid grid-cols-4 gap-2">
                    {filteredIcons.map(({ id, label, Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            icon: id,
                          }))
                        }
                        aria-label={label}
                        aria-pressed={form.icon === id}
                        className={`flex aspect-square items-center justify-center rounded-xl border-2 ${
                          form.icon === id
                            ? "border-[#FFA726] bg-[#FFF3E0]"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <Icon size={28} color="#383838" />
                      </button>
                    ))}
                  </div>

                  {filteredIcons.length === 0 && (
                    <p className="py-4 text-center text-sm text-app-muted">
                      Nenhum ícone encontrado.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => {
                    setFormOpen(false);
                    setError("");
                  }}
                  className="flex-1 rounded-xl bg-stone-100 px-4 py-3 font-semibold text-app-text"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving || !form.name.trim()}
                  className="flex-1 rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar seção"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!needsPin && sectionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-routine-title"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
          >
            <h2
              id="delete-routine-title"
              className="text-xl font-bold text-app-text"
            >
              Excluir seção?
            </h2>

            <p className="my-4 text-sm text-app-muted">
              Deseja excluir "{sectionToDelete.name}"?
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => setSectionToDelete(null)}
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

export default ManageRoutinePage;
