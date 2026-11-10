import { useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types/category";
import { getCards } from "../../services/cardService";
import type { Card } from "../../types/card";

function HomeSections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError("Não foi possível carregar as categorias.");
      }
    }

    loadCategories();
  }, []);

  async function handleOpenCategory(categoryId: string) {
    try {
      const data = await getCards();

      setCards(data.filter((card) => card.categoryId === categoryId));
      setSelectedCategory(categoryId);
    } catch {
      setError("Não foi possível carregar os cartões.");
    }
  }

  return (
    <section className="mt-4">
      <h2 className="mb-2 text-sm font-semibold text-[#383838]">Seções</h2>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="flex min-h-32 flex-col justify-between rounded-xl p-3"
            style={{ backgroundColor: category.color }}
          >
            <div>
              <h3 className="font-semibold text-[#383838]">{category.name}</h3>

              <p className="mt-1 text-xs text-[#383838]">
                {category.description}
              </p>
            </div>

            <button
              onClick={() => handleOpenCategory(category.id)}
              className="mt-3 self-start rounded-full bg-white px-4 py-1 text-xs font-medium text-[#383838]"
            >
              Abrir
            </button>
          </article>
        ))}
      </div>
      {selectedCategory && (
        <div className="mt-5">
          <h2 className="mb-3 text-lg font-semibold text-[#383838]">
            {
              categories.find((category) => category.id === selectedCategory)
                ?.name
            }
          </h2>

          {cards.length === 0 ? (
            <p className="text-sm text-gray-600">
              Ainda não existem cartões nesta categoria.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {cards.map((card) => (
                <article
                  key={card.id}
                  className="rounded-xl border bg-white p-4"
                >
                  <h3 className="font-semibold text-[#383838]">{card.title}</h3>

                  <p className="mt-1 text-sm text-gray-600">
                    {card.speechText}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default HomeSections;
