
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  MessageCircle,
  MessageSquare,
  Pencil,
  TrendingUp,
  Volume2,
} from "lucide-react";

import {
  getQuickPhrases,
  recordQuickPhraseUse,
} from "../../services/quickPhraseService";
import {
  getCards,
  recordCardUse,
} from "../../services/cardService";
import { getCategories } from "../../services/categoryService";

import type { QuickPhrase } from "../../types/quickPhrase";
import type { Card } from "../../types/card";
import type { Category } from "../../types/category";

import { quickPhraseIcons } from "../../constants/quickPhraseIcons";
import { speak } from "../../utils/speech";
import QuickPhraseCard from "../../components/common/QuickPhraseCard";

type MostUsedItem =
  | {
      kind: "phrase";
      phrase: QuickPhrase;
      usageCount: number;
    }
  | {
      kind: "card";
      card: Card;
      usageCount: number;
    };

function isEmergencyCategory(category?: Category) {
  if (!category) return false;

  const normalizedName = category.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");

  return normalizedName === "emergencia";
}

function QuickPhrasesPage() {
  const navigate = useNavigate();

  const [phrases, setPhrases] = useState<QuickPhrase[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [speakingId, setSpeakingId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [phrasesData, cardsData, categoriesData] =
          await Promise.all([
            getQuickPhrases(),
            getCards(),
            getCategories(),
          ]);

        if (!active) return;

        setPhrases(phrasesData);
        setCards(cardsData);
        setCategories(categoriesData);
        setError("");
      } catch (error) {
        console.error(
          "Erro ao carregar elementos de comunicação:",
          error,
        );

        if (active) {
          setError(
            "Não foi possível carregar as frases e cartões.",
          );
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
  }, []);

  function handleSpeakPhrase(phrase: QuickPhrase) {
    const itemId = `phrase-${phrase.id}`;

    setSpeakingId(null);

    speak(
      phrase.text,
      () => {
        setSpeakingId(itemId);

        void recordQuickPhraseUse(phrase.id)
          .then((nextCount) => {
            setPhrases((current) =>
              current.map((item) =>
                item.id === phrase.id
                  ? { ...item, usageCount: nextCount }
                  : item,
              ),
            );
          })
          .catch((error) => {
            console.error(
              "Erro ao registrar uso da frase:",
              error,
            );
          });
      },
      () => {
        setSpeakingId((current) =>
          current === itemId ? null : current,
        );
      },
    );
  }

  function handleSpeakCard(card: Card) {
    const itemId = `card-${card.id}`;

    setSpeakingId(null);

    speak(
      card.speechText,
      () => {
        setSpeakingId(itemId);

        void recordCardUse(card.id)
          .then((nextCount) => {
            setCards((current) =>
              current.map((item) =>
                item.id === card.id
                  ? { ...item, usageCount: nextCount }
                  : item,
              ),
            );
          })
          .catch((error) => {
            console.error(
              "Erro ao registrar uso do cartão:",
              error,
            );
          });
      },
      () => {
        setSpeakingId((current) =>
          current === itemId ? null : current,
        );
      },
    );
  }

  const usedPhrases: MostUsedItem[] = phrases
    .filter((phrase) => (phrase.usageCount ?? 0) > 0)
    .map((phrase) => ({
      kind: "phrase",
      phrase,
      usageCount: phrase.usageCount ?? 0,
    }));

  const usedCards: MostUsedItem[] = cards
    .filter((card) => {
      if (!card.isActive || (card.usageCount ?? 0) === 0) {
        return false;
      }

      const category = categories.find(
        (item) => item.id === card.categoryId,
      );

      return Boolean(category) && !isEmergencyCategory(category);
    })
    .map((card) => ({
      kind: "card",
      card,
      usageCount: card.usageCount ?? 0,
    }));

  const mostUsedItems = [...usedPhrases, ...usedCards]
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 4);

  const mostUsedPhraseIds = new Set(
    mostUsedItems
      .filter(
        (item): item is Extract<
          MostUsedItem,
          { kind: "phrase" }
        > => item.kind === "phrase",
      )
      .map((item) => item.phrase.id),
  );

  const remainingPhrases = phrases.filter(
    (phrase) => !mostUsedPhraseIds.has(phrase.id),
  );

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="mb-6 pt-3">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-app-text">
          Minhas Frases
        </h1>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-app-text">
            Toque em uma frase ou cartão para falar
          </p>

          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white"
          >
            <Volume2 size={20} />
          </span>
        </div>
      </header>

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-app-muted">
          Carregando frases...
        </p>
      ) : (
        <>
          <section className="mb-7">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp
                size={21}
                className="text-brand-primary"
                aria-hidden="true"
              />

              <h2 className="text-lg font-bold text-app-text">
                Mais utilizadas
              </h2>
            </div>

            {mostUsedItems.length === 0 ? (
              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm leading-relaxed text-app-muted">
                  As mensagens mais utilizadas aparecerão aqui
                  conforme você usar o ComuniCA.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {mostUsedItems.map((item) => {
                  if (item.kind === "phrase") {
                    return (
                      <QuickPhraseCard
                        key={`phrase-${item.phrase.id}`}
                        phrase={item.phrase}
                        isSpeaking={
                          speakingId ===
                          `phrase-${item.phrase.id}`
                        }
                        onSpeak={handleSpeakPhrase}
                      />
                    );
                  }

                  const category = categories.find(
                    (entry) =>
                      entry.id === item.card.categoryId,
                  );

                  const selectedIcon = quickPhraseIcons.find(
                    (entry) => entry.id === item.card.icon,
                  );

                  const Icon =
                    selectedIcon?.Icon ?? MessageCircle;

                  return (
                    <button
                      key={`card-${item.card.id}`}
                      type="button"
                      onClick={() => handleSpeakCard(item.card)}
                      aria-label={`Falar: ${item.card.title}`}
                      className={`flex min-h-40 w-full min-w-0 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 p-4 text-center transition-all active:scale-[0.98] ${
                        speakingId === `card-${item.card.id}`
                          ? "border-brand-primary shadow-md"
                          : "border-transparent"
                      }`}
                      style={{
                        backgroundColor:
                          category?.color ?? "#FFFFFF",
                      }}
                    >
                      <Icon
                        size={52}
                        strokeWidth={2.5}
                        color="#383838"
                        aria-hidden="true"
                      />

                      <span className="break-words text-sm font-semibold text-app-text">
                        {item.card.title}
                      </span>

                      {speakingId === `card-${item.card.id}` && (
                        <span
                          role="status"
                          className="flex items-center gap-1 text-xs font-medium text-[#A86400]"
                        >
                          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-primary" />
                          Falando...
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare
                size={21}
                className="text-brand-primary"
                aria-hidden="true"
              />

              <h2 className="text-lg font-bold text-app-text">
                Frases cadastradas
              </h2>
            </div>

            {remainingPhrases.length === 0 ? (
              <div className="rounded-2xl bg-white p-5">
                <p className="text-sm text-app-muted">
                  {phrases.length === 0
                    ? "Nenhuma frase cadastrada."
                    : "Todas as frases cadastradas estão na seção Mais utilizadas."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {remainingPhrases.map((phrase) => (
                  <QuickPhraseCard
                    key={phrase.id}
                    phrase={phrase}
                    isSpeaking={
                      speakingId === `phrase-${phrase.id}`
                    }
                    onSpeak={handleSpeakPhrase}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <button
        type="button"
        onClick={() => navigate("/rapidos/gerenciar")}
        aria-label="Gerenciar frases"
        className="fixed bottom-24 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-app-text shadow-lg transition-transform active:scale-95"
      >
        <Pencil size={26} strokeWidth={2.5} />
      </button>
    </main>
  );
}

export default QuickPhrasesPage;
