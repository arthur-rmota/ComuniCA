import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AlertCircle, Pencil, ChevronRight } from "lucide-react";
import { useInterface } from "../../contexts/InterfaceContext";
import { interfaceSizes } from "../../constants/interfaceSizes";
import { routineService } from "../../services/routineService";
import type { RoutineSection } from "../../types/routine";
import AppIcon from "../../components/common/AppIcon";

function AgendaPage() {
  const navigate = useNavigate();
  const { settings } = useInterface();

  const cardHeight = interfaceSizes[settings.cardSize].cardHeight;

  const textSize = interfaceSizes[settings.textSize].textSize;

  const symbolSize = interfaceSizes[settings.symbolSize].symbolSize;

  const minCardWidth = Math.max(
    136,
    cardHeight - 24,
    symbolSize + 20,
    textSize * 6 + 20,
  );
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
    <main className="relative min-h-dvh overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4 md:px-6 md:pt-6 lg:landscape:pb-8 xl:px-8 xl:pb-8 xl:pt-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-80 h-48 w-48 rounded-full bg-[#FFF0BB]/30"
      />

      <div className="app-page-container">
        <header className="mb-7 pt-3">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFE0BD]"
            >
              <AppIcon name="CalendarCheck2" size={44} />
            </span>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#42251D]">
              Minha Rotina
            </h1>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 shadow-[0_5px_14px_rgba(41,37,36,0.05)]">
            <p className="text-sm font-semibold leading-relaxed text-[#592B1D]">
              Escolha uma parte da sua rotina
            </p>

            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFE0BD]"
            >
              <ChevronRight size={23} strokeWidth={2.5} color="#C2410C" />
            </span>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-4 flex items-center gap-2 rounded-2xl bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={20} aria-hidden="true" />

            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-app-muted">Carregando rotina...</p>
        ) : error ? null : sections.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <AppIcon name="CalendarCheck2" size={64} className="mx-auto mb-3" />

            <p className="font-bold text-[#42251D]">
              Nenhuma rotina cadastrada
            </p>

            <p className="mt-2 text-sm leading-relaxed text-[#80685D]">
              As partes da sua rotina aparecerão aqui quando forem cadastradas.
            </p>
          </div>
        ) : (
          <section
            aria-label="Seções da rotina"
            className="grid gap-3 md:gap-4 [--card-min-width:0px] md:[--card-min-width:184px] xl:[--card-min-width:208px]"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, max(${minCardWidth}px, var(--card-min-width))), 1fr))`,
            }}
          >
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => navigate(`/rotina/${section.id}`)}
                aria-label={`Abrir rotina: ${section.name}`}
                className="group relative flex w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border-2 border-white/60 p-2 text-center shadow-[0_5px_14px_rgba(41,37,36,0.07)] transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                style={{
                  backgroundColor: section.color,
                  minHeight: `${cardHeight}px`,
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/15"
                />

                <AppIcon
                  name={section.icon || "CalendarCheck2"}
                  size={symbolSize}
                  className="relative max-w-full"
                />

                <span
                  className="relative w-full font-extrabold leading-tight text-[#42251D] [overflow-wrap:anywhere]"
                  style={{
                    fontSize: `${textSize}px`,
                  }}
                >
                  {section.name}
                </span>
              </button>
            ))}
          </section>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate("/rotina/gerenciar")}
        aria-label="Gerenciar rotina"
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-[#F8E5D8] bg-white text-[#592B1D] shadow-lg transition-transform active:scale-95 lg:landscape:bottom-6 xl:bottom-6"
      >
        <Pencil size={24} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </main>
  );
}

export default AgendaPage;
