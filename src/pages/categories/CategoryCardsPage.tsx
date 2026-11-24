import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router";

import { recordCardUse, cardService } from "../../services/cardService";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types/category";
import type { Card } from "../../types/card";
import AppIcon from "../../components/common/AppIcon";
import { speak } from "../../utils/speech";

export default function CategoryCardsPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [speakingCardId, setSpeakingCardId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadData() {
      setLoading(true);
      setError("");

      try {
        if (!categoryId) {
          throw new Error("Categoria não informada.");
        }

        const categories = await categoryService.getAll();
        const selected = categories.find((item) => item.id === categoryId);

        if (!selected) {
          throw new Error("Categoria não encontrada.");
        }

        const categoryCards = await cardService.getByCategory(categoryId);

        if (active) {
          setCategory(selected);
          setCards(categoryCards);
        }
      } catch (error) {
        console.error("Erro ao carregar categoria:", error);

        if (active) {
          setError("Não foi possível carregar esta categoria.");
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
  }, [categoryId]);

  function handleSpeak(card: Card) {
    setSpeakingCardId(null);

    speak(
      card.speechText,
      () => {
        setSpeakingCardId(card.id);

        const isEmergency =
          category?.name
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("pt-BR") === "emergencia";

        if (isEmergency) return;

        void recordCardUse(card.id)
          .then((nextCount) => {
            setCards((currentCards) =>
              currentCards.map((item) =>
                item.id === card.id ? { ...item, usageCount: nextCount } : item,
              ),
            );
          })
          .catch((error) => {
            console.error("Erro ao registrar uso do cartão:", error);
          });
      },
      () =>
        setSpeakingCardId((currentId) =>
          currentId === card.id ? null : currentId,
        ),
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />

      <div className="relative mx-auto w-full max-w-lg">
        <header className="mb-6 pt-3">
          <div className="relative flex min-h-14 items-center justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Voltar para o início"
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm transition-transform active:scale-95"
            >
              <ArrowLeft size={24} strokeWidth={2.5} />
            </button>

            <h1 className="break-words px-14 text-center text-2xl font-extrabold tracking-tight text-[#42251D]">
              {category?.name ?? "Cartões"}
            </h1>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 shadow-[0_5px_14px_rgba(41,37,36,0.05)]">
            <p className="text-sm font-semibold text-[#592B1D]">
              Toque em um cartão para falar
            </p>

            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFE0BD]"
            >
              <AppIcon name="Volume2" size={40} />
            </span>
          </div>
        </header>

        {loading ? (
          <p className="text-sm text-app-muted">Carregando cartões...</p>
        ) : error ? (
          <p
            role="alert"
            className="rounded-2xl bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        ) : cards.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <AppIcon name="Smile" size={64} className="mx-auto mb-3" />

            <p className="font-semibold text-[#42251D]">
              Ainda não há cartões nesta categoria.
            </p>
          </div>
        ) : (
          <section
            aria-label={`Cartões da categoria ${category?.name ?? ""}`}
            className="grid grid-cols-2 gap-3"
          >
            {cards.map((card) => {
              const isSpeaking = speakingCardId === card.id;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSpeak(card)}
                  aria-label={`Falar: ${card.speechText}`}
                  className={`group relative flex min-h-44 w-full min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border-2 p-2 text-center transition-all duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
                    isSpeaking
                      ? "border-brand-primary shadow-[0_5px_18px_rgba(194,65,12,0.18)]"
                      : "border-white/60 shadow-[0_5px_14px_rgba(41,37,36,0.07)]"
                  }`}
                  style={{
                    backgroundColor: category?.color ?? "#B8D8BA",
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
                        width={128}
                        height={128}
                        draggable={false}
                        className="h-32 w-32 select-none object-contain"
                      />
                    ) : (
                      <AppIcon name={card.icon || "Smile"} size={128} />
                    )}
                  </span>

                  <span className="relative break-words text-base font-extrabold leading-tight text-[#42251D]">
                    {card.title}
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
          </section>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          if (categoryId) {
            navigate(`/perfil/categorias/${categoryId}/cartoes`, {
              state: { origin: "category" },
            });
          }
        }}
        aria-label="Gerenciar cartões da categoria"
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full border border-[#F8E5D8] bg-white text-[#592B1D] shadow-lg transition-transform active:scale-95"
      >
        <Pencil size={24} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </main>
  );
}
