import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, CalendarCheck2, Pencil, Plus, Trash2 } from "lucide-react";
import { getCards } from "../services/cardService";
import { getQuickPhrases } from "../services/quickPhraseService";
import { getCategories } from "../services/categoryService";
import type { Card } from "../types/card";
import type { QuickPhrase } from "../types/quickPhrase";
import { useProfileContext } from "../contexts/ProfileContext";
import { PinVerificationForm } from "../components/profile/PinVerificationForm";
import { quickPhraseIcons } from "../constants/quickPhraseIcons";
import { routineService } from "../services/routineService";

import type {
  RoutineActivity,
  RoutinePeriod,
  RoutineSection,
} from "../types/routine";

type ActivityFormData = Pick<
  RoutineActivity,
  | "title"
  | "icon"
  | "period"
  | "time"
  | "linkedCardIds"
  | "linkedQuickPhraseIds"
>;

const emptyForm: ActivityFormData = {
  title: "",
  icon: "calendar-check",
  period: "morning",
  time: null,
  linkedCardIds: [],
  linkedQuickPhraseIds: [],
};

const periodLabels: Record<RoutinePeriod, string> = {
  morning: "Manhã",
  afternoon: "Tarde",
  night: "Noite",
};

function ManageRoutineActivitiesPage() {
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();

  const {
    user,
    loading: profileLoading,
    isPinVerified,
    enteredPin,
    setEnteredPin,
    verifyingPin,
    accessPinError,
    handleVerifyPin,
  } = useProfileContext();

  const needsPin = Boolean(user?.pinHash && !isPinVerified);
  const [availableCards, setAvailableCards] = useState<Card[]>([]);
  const [availablePhrases, setAvailablePhrases] = useState<QuickPhrase[]>([]);
  const [section, setSection] = useState<RoutineSection | null>(null);
  const [activities, setActivities] = useState<RoutineActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] =
    useState<RoutineActivity | null>(null);
  const [activityToDelete, setActivityToDelete] =
    useState<RoutineActivity | null>(null);

  const [form, setForm] = useState<ActivityFormData>(emptyForm);
  const [iconSearch, setIconSearch] = useState("");
  const [iconCategory, setIconCategory] = useState("Todas");

  useEffect(() => {
    if (!profileLoading && !user) {
      navigate("/perfil", { replace: true });
    }
  }, [profileLoading, user, navigate]);

  useEffect(() => {
    if (profileLoading || !user || needsPin || !sectionId) return;

    let active = true;

    async function loadData() {
      setLoading(true);

      try {
        const [
          sectionData,
          activitiesData,
          cardsData,
          phrasesData,
          categoriesData,
        ] = await Promise.all([
          routineService.getSectionById(sectionId!),
          routineService.getActivitiesBySection(sectionId!),
          getCards(),
          getQuickPhrases(),
          getCategories(),
        ]);

        if (!active) return;

        if (!sectionData) {
          setError("Seção não encontrada.");
          return;
        }

        setSection(sectionData);
        setActivities(activitiesData);
        const emergencyCategoryIds = new Set(
          categoriesData
            .filter(
              (category) =>
                category.name
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .trim()
                  .toLowerCase() === "emergencia",
            )
            .map((category) => category.id),
        );

        setAvailableCards(
          cardsData.filter(
            (card) =>
              card.isActive && !emergencyCategoryIds.has(card.categoryId),
          ),
        );

        setAvailablePhrases(phrasesData);
        setError("");
      } catch (err) {
        console.error("Erro ao carregar atividades:", err);

        if (active) {
          setError("Não foi possível carregar as atividades.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, [profileLoading, user, needsPin, sectionId]);

  function handleBack() {
    navigate("/rotina/gerenciar");
  }

  function openCreateForm() {
    setEditingActivity(null);
    setForm({
      ...emptyForm,
      linkedCardIds: [],
      linkedQuickPhraseIds: [],
    });
    setIconSearch("");
    setIconCategory("Todas");
    setError("");
    setFormOpen(true);
  }

  function openEditForm(activity: RoutineActivity) {
    setEditingActivity(activity);
    setForm({
      linkedCardIds: [...(activity.linkedCardIds ?? [])],
      linkedQuickPhraseIds: [...(activity.linkedQuickPhraseIds ?? [])],
      title: activity.title,
      icon: activity.icon,
      period: activity.period,
      time: activity.time,
    });
    setIconSearch("");
    setIconCategory("Todas");
    setError("");
    setFormOpen(true);
  }

  async function handleSave(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || needsPin || !sectionId || saving) return;

    const title = form.title.trim();

    if (!title) {
      setError("Informe o nome da atividade.");
      return;
    }

    const duplicate = activities.some(
      (activity) =>
        activity.id !== editingActivity?.id &&
        activity.period === form.period &&
        activity.title.trim().toLocaleLowerCase("pt-BR") ===
          title.toLocaleLowerCase("pt-BR"),
    );

    if (duplicate) {
      setError("Já existe uma atividade com esse nome neste período.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      if (editingActivity) {
        await routineService.updateActivity(editingActivity.id, {
          title,
          icon: form.icon,
          period: form.period,
          time: form.time || null,
          linkedCardIds: form.linkedCardIds,
          linkedQuickPhraseIds: form.linkedQuickPhraseIds,
        });
      } else {
        const nextPosition =
          Math.max(0, ...activities.map((item) => item.position)) + 1;

        await routineService.createActivity({
          sectionId,
          title,
          icon: form.icon,
          period: form.period,
          time: form.time || null,
          position: nextPosition,
          linkedCardIds: form.linkedCardIds,
          linkedQuickPhraseIds: form.linkedQuickPhraseIds,
        });
      }

      const updated = await routineService.getActivitiesBySection(sectionId);

      setActivities(updated);
      setFormOpen(false);
      setEditingActivity(null);
    } catch (err) {
      console.error("Erro ao salvar atividade:", err);
      setError("Não foi possível salvar a atividade.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user || needsPin || !activityToDelete || saving) return;

    setSaving(true);
    setError("");

    try {
      await routineService.removeActivity(activityToDelete.id);

      setActivities((current) =>
        current.filter((item) => item.id !== activityToDelete.id),
      );
      setActivityToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir atividade:", err);
      setError("Não foi possível excluir a atividade.");
    } finally {
      setSaving(false);
    }
  }

  const iconCategories = [
    "Todas",
    ...new Set(quickPhraseIcons.map((item) => item.category)),
  ];

  const filteredIcons = quickPhraseIcons.filter((item) => {
    const matchesSearch = item.label
      .toLocaleLowerCase("pt-BR")
      .includes(iconSearch.trim().toLocaleLowerCase("pt-BR"));

    return (
      matchesSearch &&
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
        Atividades — {section?.name ?? "Rotina"}
      </h1>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        {needsPin ? (
          <PinVerificationForm
            enteredPin={enteredPin}
            accessPinError={accessPinError}
            verifyingPin={verifyingPin}
            onPinChange={setEnteredPin}
            onSubmit={handleVerifyPin}
            onCancel={handleBack}
            onForgotPin={() => navigate("/perfil/recuperar-pin")}
          />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="font-semibold text-app-text">
                Atividades cadastradas
              </h2>

              <button
                type="button"
                onClick={openCreateForm}
                disabled={!section || loading}
                className="flex shrink-0 items-center gap-2 rounded-xl bg-brand-primary px-3 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                <Plus size={18} />
                Nova atividade
              </button>
            </div>

            {error && (
              <p role="alert" className="mb-4 text-sm text-red-600">
                {error}
              </p>
            )}

            {loading ? (
              <p className="text-sm text-app-muted">Carregando atividades...</p>
            ) : activities.length === 0 ? (
              <p className="text-sm text-app-muted">
                Nenhuma atividade cadastrada nesta seção.
              </p>
            ) : (
              <ul className="space-y-3">
                {activities.map((activity) => {
                  const selectedIcon = quickPhraseIcons.find(
                    (item) => item.id === activity.icon,
                  );

                  const Icon = selectedIcon?.Icon ?? CalendarCheck2;

                  return (
                    <li
                      key={activity.id}
                      className="rounded-xl border border-app-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: section?.color ?? "#FFF0D6",
                          }}
                        >
                          <Icon size={28} color="#292524" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-app-text">
                            {activity.title}
                          </h3>

                          <p className="text-sm text-app-muted">
                            {periodLabels[activity.period]}
                            {activity.time ? ` · ${activity.time}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-end gap-2 border-t border-app-border pt-3">
                        <button
                          type="button"
                          onClick={() => openEditForm(activity)}
                          className="flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm font-medium"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => setActivityToDelete(activity)}
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
              className="mt-6 w-full rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white"
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
            aria-labelledby="activity-form-title"
            className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
          >
            <h2
              id="activity-form-title"
              className="mb-5 text-xl font-bold text-app-text"
            >
              {editingActivity ? "Editar atividade" : "Nova atividade"}
            </h2>

            <form
              onSubmit={(event) => void handleSave(event)}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="activity-title"
                  className="mb-2 block text-sm font-semibold"
                >
                  Nome da atividade
                </label>
                <input
                  id="activity-title"
                  required
                  maxLength={60}
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Ex.: Hora do lanche"
                  className="w-full rounded-xl border border-gray-300 p-3 text-base"
                />
                <p className="mt-1 text-right text-xs text-gray-500">
                  {form.title.length}/60 caracteres
                </p>
              </div>

              <div>
                <label
                  htmlFor="activity-period"
                  className="mb-2 block text-sm font-semibold"
                >
                  Período do dia
                </label>
                <select
                  id="activity-period"
                  value={form.period}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      period: event.target.value as RoutinePeriod,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 bg-white p-3 text-base"
                >
                  <option value="morning">Manhã</option>
                  <option value="afternoon">Tarde</option>
                  <option value="night">Noite</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="activity-time"
                  className="mb-2 block text-sm font-semibold"
                >
                  Horário (opcional)
                </label>
                <input
                  id="activity-time"
                  type="time"
                  value={form.time ?? ""}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      time: event.target.value || null,
                    }))
                  }
                  className="w-full rounded-xl border border-gray-300 p-3 text-base"
                />
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold">Ícone da atividade</p>

                <input
                  type="search"
                  aria-label="Pesquisar ícones"
                  placeholder="Pesquisar ícone..."
                  value={iconSearch}
                  onChange={(event) => setIconSearch(event.target.value)}
                  className="mb-3 w-full rounded-xl border border-gray-300 p-3 text-base"
                />

                <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
                  {iconCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={iconCategory === category}
                      onClick={() => setIconCategory(category)}
                      className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold ${
                        iconCategory === category
                          ? "border-[#FFA726] bg-[#FFF3E0] text-[#A86400]"
                          : "border-gray-200 bg-gray-50"
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
                        aria-label={label}
                        aria-pressed={form.icon === id}
                        onClick={() =>
                          setForm((current) => ({ ...current, icon: id }))
                        }
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

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <div>
                <h3 className="mb-2 text-sm font-semibold text-app-text">
                  Mensagens relacionadas
                </h3>

                <p className="mb-4 text-sm text-app-muted">
                  Escolha os cartões e frases que a criança poderá utilizar
                  durante esta atividade.
                </p>

                <div className="space-y-4">
                  <fieldset>
                    <legend className="mb-2 font-semibold text-app-text">
                      Cartões de comunicação
                    </legend>

                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-3">
                      {availableCards.length === 0 ? (
                        <p className="text-sm text-app-muted">
                          Nenhum cartão disponível.
                        </p>
                      ) : (
                        availableCards.map((card) => (
                          <label
                            key={card.id}
                            className="flex min-h-12 items-center gap-3 rounded-xl bg-stone-50 p-3"
                          >
                            <input
                              type="checkbox"
                              checked={form.linkedCardIds.includes(card.id)}
                              onChange={(event) => {
                                setForm((current) => ({
                                  ...current,
                                  linkedCardIds: event.target.checked
                                    ? [...current.linkedCardIds, card.id]
                                    : current.linkedCardIds.filter(
                                        (id) => id !== card.id,
                                      ),
                                }));
                              }}
                              className="h-5 w-5 shrink-0 accent-orange-700"
                            />

                            <span className="text-sm font-medium text-app-text">
                              {card.title}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="mb-2 font-semibold text-app-text">
                      Frases cadastradas
                    </legend>

                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-xl border border-gray-200 p-3">
                      {availablePhrases.length === 0 ? (
                        <p className="text-sm text-app-muted">
                          Nenhuma frase disponível.
                        </p>
                      ) : (
                        availablePhrases.map((phrase) => (
                          <label
                            key={phrase.id}
                            className="flex min-h-12 items-center gap-3 rounded-xl bg-stone-50 p-3"
                          >
                            <input
                              type="checkbox"
                              checked={form.linkedQuickPhraseIds.includes(
                                phrase.id,
                              )}
                              onChange={(event) => {
                                setForm((current) => ({
                                  ...current,
                                  linkedQuickPhraseIds: event.target.checked
                                    ? [
                                        ...current.linkedQuickPhraseIds,
                                        phrase.id,
                                      ]
                                    : current.linkedQuickPhraseIds.filter(
                                        (id) => id !== phrase.id,
                                      ),
                                }));
                              }}
                              className="h-5 w-5 shrink-0 accent-orange-700"
                            />

                            <span className="text-sm font-medium text-app-text">
                              {phrase.text}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </fieldset>
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
                  className="flex-1 rounded-xl bg-stone-100 px-4 py-3 font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving || !form.title.trim()}
                  className="flex-1 rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar atividade"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!needsPin && activityToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-activity-title"
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
          >
            <h2
              id="delete-activity-title"
              className="text-xl font-bold text-app-text"
            >
              Excluir atividade?
            </h2>

            <p className="my-4 text-sm text-app-muted">
              Deseja excluir "{activityToDelete.title}"?
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
                onClick={() => setActivityToDelete(null)}
                className="flex-1 rounded-xl bg-stone-100 px-4 py-3 font-semibold"
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

export default ManageRoutineActivitiesPage;
