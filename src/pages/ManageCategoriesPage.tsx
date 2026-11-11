import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/category";

export default function ManageCategoriesPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await categoryService.getAll();

        if (active) {
          setCategories(data);
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
    <main className="min-h-screen bg-[#E5E5E5] p-4 pb-28">
      <header className="relative flex items-center justify-center py-6">
        <button
          type="button"
          onClick={() => navigate("/perfil")}
          aria-label="Voltar para o perfil"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <ArrowLeft size={22} color="#383838" />
        </button>

        <h1 className="text-xl font-semibold text-[#383838]">
          Gerenciar categorias
        </h1>
      </header>

      <section className="mt-4 rounded-2xl bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold text-[#383838]">
          Categorias cadastradas
        </h2>

        {loading ? (
          <p className="text-sm text-gray-600">Carregando categorias...</p>
        ) : error ? (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        ) : categories.length === 0 ? (
          <p className="text-sm text-gray-600">Nenhuma categoria cadastrada.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center gap-3 rounded-xl border border-gray-200 p-3"
              >
                <span
                  aria-hidden="true"
                  className="h-12 w-12 shrink-0 rounded-xl"
                  style={{ backgroundColor: category.color }}
                />

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[#383838]">
                    {category.name}
                  </h3>

                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
