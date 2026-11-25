import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getCategories } from "../../services/categoryService";
import type { Category } from "../../types/category";
import { useInterface, type InterfaceSize } from "../../contexts/InterfaceContext";
import { interfaceSizes } from "../../constants/interfaceSizes";
import AppIcon from "../common/AppIcon";

function HomeSections() {
  const navigate = useNavigate();
  const { settings } = useInterface();

  const cardHeight =
    interfaceSizes[settings.cardSize as InterfaceSize].cardHeight;

  const textSize =
    interfaceSizes[settings.textSize as InterfaceSize].textSize;

  const symbolSize =
    interfaceSizes[settings.symbolSize as InterfaceSize].symbolSize;

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
    <section className="mt-8">
      <div className="mb-5 flex items-center gap-2">
        <AppIcon name="MessageCircleHeart" size={32} />

        <h2 className="text-xl font-extrabold tracking-tight text-[#42251D]">
          Quero me comunicar
        </h2>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-app-muted">Carregando categorias...</p>
      ) : categories.length === 0 ? (
        <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
          <p className="text-sm text-app-muted">
            Nenhuma categoria disponível.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => navigate(`/categorias/${category.id}`)}
              aria-label={`Abrir categoria ${category.name}`}
              className="group relative flex min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border-2 border-white/60 p-2 text-center shadow-[0_5px_14px_rgba(41,37,36,0.07)] transition-transform duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
              style={{
                backgroundColor: category.color,
                minHeight: `${cardHeight}px`,
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/15"
              />

              <AppIcon name={category.icon} size={symbolSize} className="relative" />

              <span className="relative break-words font-extrabold leading-tight text-[#42251D]" style={{ fontSize: `${textSize}px`}}>
                {category.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

export default HomeSections;
