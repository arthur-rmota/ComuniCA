import { useEffect, useState } from "react";
import { ArrowUpRight, Folder } from "lucide-react";
import { useNavigate } from "react-router";

import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types/category";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";

function HomeSections() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await getCategories();

        if (active) {
          setCategories(data);
          setError("");
        }
      } catch (error) {
        console.error("Erro ao carregar categorias:", error);

        if (active) {
          setError("Não foi possível carregar as categorias.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mt-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-app-text">Categorias</h2>
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-app-danger">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-app-muted">Carregando categorias...</p>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl bg-white p-5">
          <p className="text-sm text-app-muted">
            Nenhuma categoria disponível.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const selectedIcon = quickPhraseIcons.find(
              (item) => item.id === category.icon,
            );

            const Icon = selectedIcon?.Icon ?? Folder;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => navigate(`/categorias/${category.id}`)}
                aria-label={`Abrir categoria ${category.name}`}
                className="flex min-h-40 min-w-0 flex-col items-center justify-center gap-4 rounded-2xl p-4 text-center transition-transform duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                style={{
                  backgroundColor: category.color,
                }}
              >
                <Icon
                  size={48}
                  color="#292524"
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <span className="break-words text-base font-bold leading-tight text-app-text">
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default HomeSections;
