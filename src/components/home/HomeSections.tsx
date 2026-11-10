import { useEffect, useState } from 'react';
import { getCategories } from '../../services/categoryService';
import type { Category } from '../../types/category';

function HomeSections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError('Não foi possível carregar as categorias.');
      }
    }

    loadCategories();
  }, []);

  return (
    <section className="mt-4">
      <h2 className="mb-2 text-sm font-semibold text-[#383838]">
        Seções
      </h2>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="flex min-h-32 flex-col justify-between rounded-xl p-3"
            style={{ backgroundColor: category.color }}
          >
            <div>
              <h3 className="font-semibold text-[#383838]">
                {category.name}
              </h3>

              <p className="mt-1 text-xs text-[#383838]">
                {category.description}
              </p>
            </div>

            <button className="mt-3 self-start rounded-full bg-white px-4 py-1 text-xs font-medium text-[#383838]">
              Abrir
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default HomeSections;