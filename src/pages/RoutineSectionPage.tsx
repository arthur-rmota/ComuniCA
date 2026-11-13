import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarCheck2,
  Moon,
  Sun,
  Sunrise,
  AlertCircle,
} from "lucide-react";

import { routineService } from "../services/routineService";
import { quickPhraseIcons } from "../constants/quickPhraseIcons";

import type {
  RoutineActivity,
  RoutinePeriod,
  RoutineSection,
} from "../types/routine";

const periods = [
  {
    id: "morning",
    label: "Manhã",
    Icon: Sunrise,
  },
  {
    id: "afternoon",
    label: "Tarde",
    Icon: Sun,
  },
  {
    id: "night",
    label: "Noite",
    Icon: Moon,
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
        setError("");
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
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="mb-6 pt-3">
        <button
          type="button"
          onClick={() => navigate("/agenda")}
          aria-label="Voltar para Minha Rotina"
          className="mb-5 flex items-center gap-2 text-app-text"
        >
          <ArrowLeft size={22} />
          <span className="font-medium">Voltar</span>
        </button>

        <h1 className="text-center text-2xl font-bold tracking-tight text-app-text">
          {section?.name ?? "Minha Rotina"}
        </h1>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-app-text">
            Veja o que vamos fazer
          </p>

          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white"
          >
            <CalendarCheck2 size={20} />
          </span>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-app-muted">Carregando atividades...</p>
      ) : error ? (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={20} />
          {error}
        </div>
      ) : activities.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <CalendarCheck2
            size={44}
            className="mx-auto mb-3 text-brand-primary"
          />

          <p className="font-semibold text-app-text">Ainda não há atividades</p>

          <p className="mt-2 text-sm text-app-muted">
            As atividades desta rotina aparecerão aqui quando forem cadastradas.
          </p>
        </div>
      ) : (
        <div className="space-y-7">
          {periods.map(({ id, label, Icon: PeriodIcon }) => {
            const periodActivities = getActivitiesByPeriod(id);

            if (periodActivities.length === 0) return null;

            return (
              <section
                key={id}
                aria-label={`Atividades da ${label.toLowerCase()}`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <PeriodIcon
                    size={24}
                    className="text-brand-primary"
                    aria-hidden="true"
                  />

                  <h2 className="text-lg font-bold text-app-text">{label}</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {periodActivities.map((activity) => {
                    const selectedIcon = quickPhraseIcons.find(
                      (item) => item.id === activity.icon,
                    );

                    const ActivityIcon = selectedIcon?.Icon ?? CalendarCheck2;

                    return (
                      <button
                        key={activity.id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/rotina/${sectionId}/atividades/${activity.id}`,
                          )
                        }
                        aria-label={`Abrir atividade: ${activity.title}`}
                        className="flex min-h-40 min-w-0 flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                        style={{
                          backgroundColor: section?.color ?? "#FFF0D6",
                        }}
                      >
                        <ActivityIcon
                          size={48}
                          strokeWidth={2.2}
                          color="#292524"
                          aria-hidden="true"
                        />

                        <h3 className="break-words text-base font-bold text-app-text">
                          {activity.title}
                        </h3>

                        {activity.time && (
                          <span className="rounded-full bg-white/70 px-3 py-1 text-sm font-semibold text-app-text">
                            {activity.time}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default RoutineSectionPage;
