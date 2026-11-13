import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { categoryService } from "../services/categoryService";
import { cardService } from "../services/cardService";
import type { Category } from "../types/category";
import type { Card } from "../types/card";
import { speak } from "../utils/speech";
import { quickPhraseIcons } from "../constants/quickPhraseIcons";

export default function CategoryCardsPage() {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
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
      } catch {
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

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="relative flex items-center justify-center py-6">
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Voltar para o início"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <ArrowLeft size={22} color="#383838" />
        </button>

        <h1 className="text-xl font-semibold text-app-text">
          {category?.name ?? "Cartões"}
        </h1>
      </header>

      <section className="mt-4 rounded-2xl bg-white p-5">
        {loading ? (
          <p className="text-sm text-app-muted">Carregando cartões...</p>
        ) : error ? (
          <p role="alert" className="text-sm text-app-danger">
            {error}
          </p>
        ) : cards.length === 0 ? (
          <p className="text-sm text-app-muted">
            Ainda não existem cartões nesta categoria.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {cards.map((card) => {
              const selectedIcon = quickPhraseIcons.find(
                (item) => item.id === (card.icon ?? "message-circle"),
              );

              const Icon = selectedIcon?.Icon;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => speak(card.speechText)}
                  aria-label={`Falar: ${card.speechText}`}
                  className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-xl border border-app-border bg-white p-4 text-center transition active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  {Icon ? (
                    <Icon
                      size={44}
                      color="#383838"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  ) : card.image ? (
                    <img
                      src={card.image}
                      alt=""
                      className="h-16 w-16 object-contain"
                    />
                  ) : null}

                  <span className="font-semibold text-app-text">
                    {card.title}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
