import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  MessageCircle,
  MessageSquare,
  Pencil,
  TrendingUp,
  Volume2,
  MessageCircleHeartIcon
} from "lucide-react";

import {
  getQuickPhrases,
  recordQuickPhraseUse,
} from "../../services/quickPhraseService";
import { getCards, recordCardUse } from "../../services/cardService";
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
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [phrasesData, cardsData, categoriesData] = await Promise.all([
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
        console.error("Erro ao carregar elementos de comunicação:", error);

        if (active) {
          setError("Não foi possível carregar as frases e cartões.");
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
            console.error("Erro ao registrar uso da frase:", error);
          });
      },
      () => {
        setSpeakingId((current) => (current === itemId ? null : current));
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
                item.id === card.id ? { ...item, usageCount: nextCount } : item,
              ),
            );
          })
          .catch((error) => {
            console.error("Erro ao registrar uso do cartão:", error);
          });
      },
      () => {
        setSpeakingId((current) => (current === itemId ? null : current));
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

      const category = categories.find((item) => item.id === card.categoryId);

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
        (item): item is Extract<MostUsedItem, { kind: "phrase" }> =>
          item.kind === "phrase",
      )
      .map((item) => item.phrase.id),
  );

  const remainingPhrases = phrases.filter(
    (phrase) => !mostUsedPhraseIds.has(phrase.id),
  );

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
          <div className="mb-5 flex items-center justify-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFE0BD]"
            >
              <MessageCircleHeartIcon
                size={29}
                strokeWidth={2.4}
                color="#C2410C"
              />
            </span>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#42251D]">
              Minhas Frases
            </h1>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 shadow-[0_5px_14px_rgba(41,37,36,0.05)]">
            <p className="text-sm font-semibold text-[#592B1D]">
              Toque em uma frase ou cartão para falar
            </p>

            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFE0BD] text-brand-primary"
            >
              <Volume2 size={23} strokeWidth={2.5} />
            </span>
          </div>
        </header>

        {error && (
          <p
            role="alert"
            className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-app-muted">Carregando frases...</p>
        ) : (
          <>
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFE0BD] text-brand-primary">
                  <TrendingUp size={24} strokeWidth={2.4} />
                </span>

                <div>
                  <h2 className="text-xl font-extrabold text-[#42251D]">
                    Mais utilizadas
                  </h2>

                  <p className="mt-1 text-xs font-medium text-[#80685D]">
                    Suas mensagens preferidas no dia a dia
                  </p>
                </div>
              </div>

              {mostUsedItems.length === 0 ? (
                <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                  <TrendingUp
                    size={40}
                    className="mx-auto mb-3 text-brand-primary"
                    aria-hidden="true"
                  />

                  <p className="text-sm font-medium leading-relaxed text-[#80685D]">
                    As mensagens mais utilizadas aparecerão aqui conforme você
                    usar o ComuniCA.
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
                          isSpeaking={speakingId === `phrase-${item.phrase.id}`}
                          onSpeak={handleSpeakPhrase}
                        />
                      );
                    }

                    const category = categories.find(
                      (entry) => entry.id === item.card.categoryId,
                    );

                    const selectedIcon = quickPhraseIcons.find(
                      (entry) => entry.id === item.card.icon,
                    );

                    const Icon = selectedIcon?.Icon ?? MessageCircle;

                    const isSpeaking = speakingId === `card-${item.card.id}`;

                    return (
                      <button
                        key={`card-${item.card.id}`}
                        type="button"
                        onClick={() => handleSpeakCard(item.card)}
                        aria-label={`Falar: ${item.card.speechText}`}
                        className={`group relative flex min-h-44 w-full min-w-0 flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-2 p-4 text-center transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
                          isSpeaking
                            ? "border-brand-primary shadow-[0_5px_18px_rgba(194,65,12,0.18)]"
                            : "border-white/60 shadow-[0_5px_14px_rgba(41,37,36,0.07)]"
                        }`}
                        style={{
                          backgroundColor: category?.color ?? "#DDEBFA",
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
                          {item.card.image && !item.card.icon ? (
                            <img
                              src={item.card.image}
                              alt=""
                              className="h-16 w-16 object-contain"
                            />
                          ) : (
                            <Icon size={58} strokeWidth={2.2} color="#42251D" />
                          )}
                        </span>

                        <span className="relative break-words text-base font-extrabold leading-tight text-[#42251D]">
                          {item.card.title}
                        </span>

                        {isSpeaking && (
                          <span
                            role="status"
                            className="relative flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-[#9A3412]"
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
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F3DDFC] text-[#8B47A7]">
                  <MessageSquare size={24} strokeWidth={2.4} />
                </span>

                <div>
                  <h2 className="text-xl font-extrabold text-[#42251D]">
                    Frases cadastradas
                  </h2>

                  <p className="mt-1 text-xs font-medium text-[#80685D]">
                    Escolha o que você quer dizer
                  </p>
                </div>
              </div>

              {remainingPhrases.length === 0 ? (
                <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                  <MessageSquare
                    size={40}
                    className="mx-auto mb-3 text-brand-primary"
                    aria-hidden="true"
                  />

                  <p className="text-sm font-medium text-[#80685D]">
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
                      isSpeaking={speakingId === `phrase-${phrase.id}`}
                      onSpeak={handleSpeakPhrase}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate("/rapidos/gerenciar")}
        aria-label="Gerenciar frases"
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-[#F8E5D8] bg-white text-[#592B1D] shadow-lg transition-transform active:scale-95"
      >
        <Pencil size={24} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </main>
  );
}

export default QuickPhrasesPage;
