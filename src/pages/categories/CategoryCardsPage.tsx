import { useEffect, useState } from "react";
import { ArrowLeft, Smile, Volume2, Pencil } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { recordCardUse } from "../../services/cardService";
import { categoryService } from "../../services/categoryService";
import { cardService } from "../../services/cardService";
import type { Category } from "../../types/category";
import type { Card } from "../../types/card";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";
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

        // Cartões de emergência ficam fora das estatísticas gerais.
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
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="relative mb-5 pt-3">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Voltar para o início"
          className="absolute left-0 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <ArrowLeft size={22} color="#383838" />
        </button>

        <h1 className="mb-6 px-12 text-center text-2xl font-bold tracking-tight text-app-text">
          {category?.name ?? "Cartões"}
        </h1>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-app-text">
            Toque em um cartão para falar
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
        <p className="text-sm text-app-muted">Carregando cartões...</p>
      ) : error ? (
        <p role="alert" className="text-sm text-app-danger">
          {error}
        </p>
      ) : cards.length === 0 ? (
        <div className="rounded-xl bg-white p-5">
          <p className="text-sm text-app-muted">
            Ainda não existem cartões nesta categoria.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {cards.map((card) => {
            const selectedIcon = quickPhraseIcons.find(
              (item) => item.id === card.icon,
            );

            const Icon = selectedIcon?.Icon ?? Smile;
            const isSpeaking = speakingCardId === card.id;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleSpeak(card)}
                aria-label={`Falar: ${card.speechText}`}
                className={`relative flex min-h-40 w-full min-w-0 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 p-4 text-center transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
                  isSpeaking
                    ? "border-brand-primary shadow-md"
                    : "border-transparent"
                }`}
                style={{
                  backgroundColor: category?.color ?? "#B8D8BA",
                }}
              >
                <span aria-hidden="true">
                  {card.image && !card.icon ? (
                    <img
                      src={card.image}
                      alt=""
                      className="h-14 w-14 object-contain"
                    />
                  ) : (
                    <Icon size={52} strokeWidth={2.5} color="#383838" />
                  )}
                </span>

                <span className="break-words text-sm font-semibold text-app-text">
                  {card.title}
                </span>

                {isSpeaking && (
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

      <button
        type="button"
        onClick={() => {
          if (categoryId) {
            navigate(`/perfil/categorias/${categoryId}/cartoes`, {
              state: { origin: "category" },
            });
          }
        }}
        aria-label="Gerenciar categorias"
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-white text-app-text shadow-lg transition-transform active:scale-95"
      >
        <Pencil size={24} aria-hidden="true" />
      </button>
    </main>
  );
}
