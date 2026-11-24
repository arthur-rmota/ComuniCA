import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, AlertCircle } from "lucide-react";

import AppIcon from "../../components/common/AppIcon";
import { routineService } from "../../services/routineService";

import type {
  RoutineActivity,
  RoutinePeriod,
  RoutineSection,
} from "../../types/routine";

const periods = [
  {
    id: "morning",
    label: "Manhã",
    icon: "Sunrise",
    background: "#FFF0CE",
  },
  {
    id: "afternoon",
    label: "Tarde",
    icon: "Sun",
    background: "#FFE0BD",
  },
  {
    id: "night",
    label: "Noite",
    icon: "Moon",
    background: "#E8DEFA",
  },
] as const;

function RoutineSectionPage() {
  const navigate = useNavigate();
  const { sectionId } = useParams<{ sectionId: string }>();

  const [section, setSection] = useState<RoutineSection | null>(null);
  const [activities, setActivities] = useState<RoutineActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSection() {
      setLoading(true);
      setError("");

      if (!sectionId) {
        setError("Seção inválida.");
        setLoading(false);
        return;
      }

      try {
        const [sectionData, activitiesData] = await Promise.all([
          routineService.getSectionById(sectionId),
          routineService.getActivitiesBySection(sectionId),
        ]);

        if (!active) return;

        if (!sectionData) {
          setError("Esta seção não foi encontrada.");
          return;
        }

        setSection(sectionData);
        setActivities(activitiesData);
      } catch (err) {
        console.error("Erro ao carregar atividades:", err);

        if (active) {
          setError("Não foi possível carregar esta rotina.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSection();

    return () => {
      active = false;
    };
  }, [sectionId]);

  function getActivitiesByPeriod(period: RoutinePeriod) {
    return activities
      .filter((activity) => activity.period === period)
      .sort((a, b) => {
        if (a.time && b.time) {
          return a.time.localeCompare(b.time) || a.position - b.position;
        }

        if (a.time) return -1;
        if (b.time) return 1;

        return a.position - b.position;
      });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-80 h-48 w-48 rounded-full bg-[#FFF0BB]/30"
      />

      <div className="relative mx-auto w-full max-w-lg">
        <header className="mb-7 pt-3">
          <div className="relative flex min-h-14 items-center justify-center">
            <button
              type="button"
              onClick={() => navigate("/agenda")}
              aria-label="Voltar para Minha Rotina"
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm transition-transform active:scale-95"
            >
              <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
            </button>

            <h1 className="break-words px-14 text-center text-2xl font-extrabold tracking-tight text-[#42251D]">
              {section?.name ?? "Minha Rotina"}
            </h1>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 shadow-[0_5px_14px_rgba(41,37,36,0.05)]">
            <p className="text-sm font-semibold text-[#592B1D]">
              Escolha uma atividade
            </p>

            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFE0BD]"
            >
              <AppIcon name="CalendarCheck2" size={40} />
            </span>
          </div>
        </header>

        {loading ? (
          <p className="text-sm text-app-muted">Carregando atividades...</p>
        ) : error ? (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            <AlertCircle size={20} aria-hidden="true" />
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <AppIcon name="CalendarCheck2" size={64} className="mx-auto mb-3" />

            <p className="font-extrabold text-[#42251D]">
              Ainda não há atividades
            </p>

            <p className="mt-2 text-sm leading-relaxed text-[#80685D]">
              As atividades desta rotina aparecerão aqui quando forem
              cadastradas.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {periods.map(({ id, label, icon, background }) => {
              const periodActivities = getActivitiesByPeriod(id);

              if (periodActivities.length === 0) return null;

              return (
                <section
                  key={id}
                  aria-label={`Atividades da ${label.toLowerCase()}`}
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: background }}
                    >
                      <AppIcon name={icon} size={44} />
                    </span>

                    <h2 className="text-xl font-extrabold text-[#42251D]">
                      {label}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {periodActivities.map((activity) => (
                      <button
                        key={activity.id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/rotina/${sectionId}/atividades/${activity.id}`,
                          )
                        }
                        aria-label={`Abrir atividade: ${activity.title}${
                          activity.time ? `, às ${activity.time}` : ""
                        }`}
                        className="group relative flex min-h-44 w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border-2 border-white/60 p-2 text-center shadow-[0_5px_14px_rgba(41,37,36,0.07)] transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                        style={{
                          backgroundColor: section?.color ?? "#FFF0D6",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/15"
                        />

                        <AppIcon
                          name={
                            activity.icon === "balloons"
                              ? "Balloon"
                              : activity.icon || "CalendarCheck2"
                          }
                          size={128}
                          className="relative"
                        />

                        <span className="relative break-words text-base font-extrabold leading-tight text-[#42251D]">
                          {activity.title}
                        </span>

                        {activity.time && (
                          <span className="relative mt-1 rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-[#592B1D]">
                            {activity.time}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default RoutineSectionPage;
