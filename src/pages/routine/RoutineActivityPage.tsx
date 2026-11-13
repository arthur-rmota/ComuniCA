
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarCheck2,
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

import type { RoutineActivity, RoutineSection } from "../../types/routine";
import type { Card } from "../../types/card";
import type { QuickPhrase } from "../../types/quickPhrase";
import type { Category } from "../../types/category";

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
      if (!sectionId || !activityId) {
        setError("Atividade inválida.");
        setLoading(false);
        return;
      }

      setLoading(true);

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

        setError("");
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
      () =>
        setSpeakingId((current) =>
          current === itemId ? null : current,
        ),
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
      () =>
        setSpeakingId((current) =>
          current === itemId ? null : current,
        ),
    );
  }

  const hasMessages = cards.length > 0 || phrases.length > 0;

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="mb-6 pt-3">
        <button
          type="button"
          onClick={() =>
            navigate(sectionId ? `/rotina/${sectionId}` : "/agenda")
          }
          className="mb-5 flex items-center gap-2 text-app-text"
        >
          <ArrowLeft size={22} aria-hidden="true" />
          Voltar
        </button>

        <h1 className="mb-5 text-center text-2xl font-bold tracking-tight text-app-text">
          {activity?.title ?? "Minha atividade"}
        </h1>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-app-text">
            Toque em uma mensagem para falar
          </p>

          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white"
          >
            <Volume2 size={20} />
          </span>
        </div>
      </header>

      {loading ? (
        <p className="text-sm text-app-muted">
          Carregando mensagens...
        </p>
      ) : error ? (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      ) : !hasMessages ? (
        <div className="rounded-2xl bg-white p-6 text-center">
          <CalendarCheck2
            size={44}
            className="mx-auto mb-3 text-brand-primary"
          />

          <p className="font-semibold text-app-text">
            Nenhuma mensagem relacionada
          </p>

          <p className="mt-2 text-sm text-app-muted">
            As mensagens desta atividade aparecerão aqui
            quando forem associadas pelo responsável.
          </p>
        </div>
      ) : (
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
                className={`flex min-h-40 min-w-0 flex-col items-center justify-center gap-3 rounded-2xl border-2 p-4 text-center transition-transform active:scale-[0.98] ${
                  isSpeaking
                    ? "border-brand-primary shadow-md"
                    : "border-transparent"
                }`}
                style={{
                  backgroundColor:
                    category?.color ?? section?.color ?? "#DDEBFA",
                }}
              >
                {card.image && !card.icon ? (
                  <img
                    src={card.image}
                    alt=""
                    className="h-14 w-14 object-contain"
                  />
                ) : (
                  <Icon
                    size={52}
                    strokeWidth={2.5}
                    color="#292524"
                    aria-hidden="true"
                  />
                )}

                <span className="break-words text-sm font-semibold text-app-text">
                  {card.title}
                </span>

                {isSpeaking && (
                  <span role="status" className="text-xs font-medium text-[#9A3412]">
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
      )}
    </main>
  );
}

export default RoutineActivityPage;
