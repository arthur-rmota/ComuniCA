import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, CalendarCheck2, Pencil } from "lucide-react";

import { routineService } from "../services/routineService";
import { quickPhraseIcons } from "../constants/quickPhraseIcons";
import type { RoutineSection } from "../types/routine";

function AgendaPage() {
  const navigate = useNavigate();

  const [sections, setSections] = useState<RoutineSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSections() {
      try {
        const data = await routineService.getSections();

        if (active) {
          setSections(data);
          setError("");
        }
      } catch (error) {
        console.error("Erro ao carregar rotina:", error);

        if (active) {
          setError("Não foi possível carregar sua rotina.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadSections();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="mb-6 pt-3">
        <h1 className="mb-5 text-center text-2xl font-bold tracking-tight text-app-text">
          Minha Rotina
        </h1>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-app-text">
            Escolha uma parte da sua rotina
          </p>

          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white"
          >
            <CalendarCheck2 size={20} />
          </span>
        </div>
      </header>

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          <AlertCircle size={18} aria-hidden="true" />
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-app-muted">Carregando rotina...</p>
      ) : sections.length === 0 ? (
        <div className="rounded-2xl bg-white p-5 text-center">
          <CalendarCheck2
            size={40}
            className="mx-auto mb-3 text-brand-primary"
            aria-hidden="true"
          />

          <p className="text-sm text-app-muted">
            Sua rotina ainda não tem seções.
          </p>
        </div>
      ) : (
        <section
          aria-label="Seções da rotina"
          className="grid grid-cols-2 gap-3"
        >
          {sections.map((section) => {
            const selectedIcon = quickPhraseIcons.find(
              (item) => item.id === section.icon,
            );

            const Icon = selectedIcon?.Icon ?? CalendarCheck2;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => navigate(`/rotina/${section.id}`)}
                aria-label={`Abrir rotina: ${section.name}`}
                className="flex min-h-40 w-full min-w-0 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-transparent p-4 text-center transition-transform active:scale-[0.98] focus-visible:border-brand-primary focus-visible:outline-none"
                style={{ backgroundColor: section.color }}
              >
                <Icon
                  size={56}
                  strokeWidth={2.2}
                  color="#292524"
                  aria-hidden="true"
                />

                <span className="break-words text-base font-bold text-app-text">
                  {section.name}
                </span>
              </button>
            );
          })}
        </section>
      )}

      <button
        type="button"
        onClick={() => navigate("/rotina/gerenciar")}
        aria-label="Gerenciar rotina"
        className="fixed bottom-24 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-app-text shadow-lg transition-transform active:scale-95"
      >
        <Pencil size={26} strokeWidth={2.5} />
      </button>
    </main>
  );
}

export default AgendaPage;
