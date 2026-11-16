import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarCheck2,
  Clock3,
  MessageCircle,
  Volume2,
} from "lucide-react";

import { routineService } from "../../services/routineService";
import { getCards, recordCardUse } from "../../services/cardService";
import {
  getQuickPhrases,
  recordQuickPhraseUse,
} from "../../services/quickPhraseService";
import { getCategories } from "../../services/categoryService";

import { quickPhraseIcons } from "../../constants/quickPhraseIcons";
import QuickPhraseCard from "../../components/common/QuickPhraseCard";
import { speak } from "../../utils/speech";

import type {
  RoutineActivity,
  RoutinePeriod,
  RoutineSection,
} from "../../types/routine";
import type { Card } from "../../types/card";
import type { QuickPhrase } from "../../types/quickPhrase";
import type { Category } from "../../types/category";

const periodLabels: Record<RoutinePeriod, string> = {
  morning: "Manhã",
  afternoon: "Tarde",
  night: "Noite",
};

function RoutineActivityPage() {
  const navigate = useNavigate();

  const { sectionId, activityId } = useParams<{
    sectionId: string;
    activityId: string;
  }>();

  const [section, setSection] = useState<RoutineSection | null>(null);
  const [activity, setActivity] = useState<RoutineActivity | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [phrases, setPhrases] = useState<QuickPhrase[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");

      if (!sectionId || !activityId) {
        setError("Atividade inválida.");
        setLoading(false);
        return;
      }

      try {
        const [
          sectionData,
          activitiesData,
          cardsData,
          phrasesData,
          categoriesData,
        ] = await Promise.all([
          routineService.getSectionById(sectionId),
          routineService.getActivitiesBySection(sectionId),
          getCards(),
          getQuickPhrases(),
          getCategories(),
        ]);

        if (!active) return;

        const selectedActivity = activitiesData.find(
          (item) => item.id === activityId,
        );

        if (!sectionData || !selectedActivity) {
          setError("Esta atividade não foi encontrada.");
          return;
        }

        setSection(sectionData);
        setActivity(selectedActivity);
        setCategories(categoriesData);

        const emergencyCategoryIds = new Set(
          categoriesData
            .filter(
              (category) =>
                category.name
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .trim()
                  .toLocaleLowerCase("pt-BR") === "emergencia",
            )
            .map((category) => category.id),
        );

        setCards(
          cardsData.filter(
            (card) =>
              selectedActivity.linkedCardIds.includes(card.id) &&
              card.isActive &&
              !emergencyCategoryIds.has(card.categoryId),
          ),
        );

        setPhrases(
          phrasesData.filter((phrase) =>
            selectedActivity.linkedQuickPhraseIds.includes(phrase.id),
          ),
        );
      } catch (err) {
        console.error("Erro ao carregar comunicação da rotina:", err);

        if (active) {
          setError("Não foi possível carregar as mensagens.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      active = false;
    };
  }, [sectionId, activityId]);

  function handleSpeakCard(card: Card) {
    const itemId = `card-${card.id}`;
    setSpeakingId(null);

    speak(
      card.speechText,
      () => {
        setSpeakingId(itemId);

        void recordCardUse(card.id).catch((err) => {
          console.error("Erro ao registrar uso do cartão:", err);
        });
      },
      () => setSpeakingId((current) => (current === itemId ? null : current)),
    );
  }

  function handleSpeakPhrase(phrase: QuickPhrase) {
    const itemId = `phrase-${phrase.id}`;
    setSpeakingId(null);

    speak(
      phrase.text,
      () => {
        setSpeakingId(itemId);

        void recordQuickPhraseUse(phrase.id).catch((err) => {
          console.error("Erro ao registrar uso da frase:", err);
        });
      },
      () => setSpeakingId((current) => (current === itemId ? null : current)),
    );
  }

  const hasMessages = cards.length > 0 || phrases.length > 0;

  const selectedActivityIcon = quickPhraseIcons.find(
    (item) => item.id === activity?.icon,
  );

  const ActivityIcon = selectedActivityIcon?.Icon ?? CalendarCheck2;

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
              onClick={() =>
                navigate(sectionId ? `/rotina/${sectionId}` : "/agenda")
              }
              aria-label="Voltar para a seção da rotina"
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm transition-transform active:scale-95"
            >
              <ArrowLeft size={24} strokeWidth={2.5} />
            </button>

            <h1 className="break-words px-14 text-center text-2xl font-extrabold tracking-tight text-[#42251D]">
              Minha Atividade
            </h1>
          </div>

          {activity && (
            <div
              className="mt-5 flex items-center gap-4 rounded-3xl border-2 border-white/60 p-4 shadow-[0_5px_14px_rgba(41,37,36,0.06)]"
              style={{
                backgroundColor: section?.color ?? "#FFE0BD",
              }}
            >
              <span
                aria-hidden="true"
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/60"
              >
                <ActivityIcon size={39} strokeWidth={2.2} color="#42251D" />
              </span>

              <div className="min-w-0 flex-1">
                <h2 className="break-words text-lg font-extrabold text-[#42251D]">
                  {activity.title}
                </h2>

                {section && (
                  <p className="mt-1 text-sm font-semibold text-[#592B1D]">
                    {section.name}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-[#592B1D]">
                    {periodLabels[activity.period]}
                  </span>

                  {activity.time && (
                    <span className="flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-[#592B1D]">
                      <Clock3 size={13} aria-hidden="true" />
                      {activity.time}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 shadow-[0_5px_14px_rgba(41,37,36,0.05)]">
            <p className="text-sm font-semibold leading-relaxed text-[#592B1D]">
              Toque em uma mensagem para falar
            </p>

            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFE0BD]"
            >
              <Volume2 size={23} strokeWidth={2.5} color="#C2410C" />
            </span>
          </div>
        </header>

        {loading ? (
          <p className="text-sm text-app-muted">Carregando mensagens...</p>
        ) : error ? (
          <p
            role="alert"
            className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700"
          >
            {error}
          </p>
        ) : !hasMessages ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <CalendarCheck2
              size={44}
              className="mx-auto mb-3 text-brand-primary"
              aria-hidden="true"
            />

            <p className="font-extrabold text-[#42251D]">
              Nenhuma mensagem relacionada
            </p>

            <p className="mt-2 text-sm leading-relaxed text-[#80685D]">
              As mensagens desta atividade aparecerão aqui quando forem
              associadas pelo responsável.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-2">
              <MessageCircle
                size={25}
                strokeWidth={2.2}
                className="text-brand-primary"
                aria-hidden="true"
              />

              <h2 className="text-xl font-extrabold text-[#42251D]">
                Quero me comunicar
              </h2>
            </div>

            <section
              aria-label="Mensagens relacionadas à atividade"
              className="grid grid-cols-2 gap-3"
            >
              {cards.map((card) => {
                const selectedIcon = quickPhraseIcons.find(
                  (item) => item.id === card.icon,
                );

                const Icon = selectedIcon?.Icon ?? MessageCircle;

                const category = categories.find(
                  (item) => item.id === card.categoryId,
                );

                const itemId = `card-${card.id}`;
                const isSpeaking = speakingId === itemId;

                return (
                  <button
                    key={itemId}
                    type="button"
                    onClick={() => handleSpeakCard(card)}
                    aria-label={`Falar: ${card.speechText}`}
                    className={`group relative flex min-h-44 w-full min-w-0 flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-2 p-4 text-center transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
                      isSpeaking
                        ? "border-brand-primary shadow-[0_5px_18px_rgba(194,65,12,0.18)]"
                        : "border-white/60 shadow-[0_5px_14px_rgba(41,37,36,0.07)]"
                    }`}
                    style={{
                      backgroundColor:
                        category?.color ?? section?.color ?? "#DDEBFA",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/15"
                    />

                    <span
                      aria-hidden="true"
                      className="relative flex items-center justify-center"
                    >
                      {card.image && !card.icon ? (
                        <img
                          src={card.image}
                          alt=""
                          className="h-16 w-16 object-contain"
                        />
                      ) : (
                        <Icon size={58} strokeWidth={2.2} color="#42251D" />
                      )}
                    </span>

                    <span className="relative break-words text-base font-extrabold leading-tight text-[#42251D]">
                      {card.title}
                    </span>

                    {isSpeaking && (
                      <span
                        role="status"
                        className="relative flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-xs font-bold text-[#9A3412]"
                      >
                        <span className="h-2 w-2 animate-pulse rounded-full bg-brand-primary" />
                        Falando...
                      </span>
                    )}
                  </button>
                );
              })}

              {phrases.map((phrase) => (
                <QuickPhraseCard
                  key={`phrase-${phrase.id}`}
                  phrase={phrase}
                  isSpeaking={speakingId === `phrase-${phrase.id}`}
                  onSpeak={handleSpeakPhrase}
                />
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default RoutineActivityPage;
