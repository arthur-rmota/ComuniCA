import { ArrowLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/category";
import { useProfileContext } from "../contexts/ProfileContext";
import { PinVerificationForm } from "../components/profile/PinVerificationForm";

export default function ManageCategoriesPage() {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const {
    user,
    loading: profileLoading,
    isPinVerified,
    setIsPinVerified,
    enteredPin,
    setEnteredPin,
    verifyingPin,
    accessPinError,
    setAccessPinError,
    handleVerifyPin,
  } = useProfileContext();

  const needsPin = Boolean(user?.pinHash && !isPinVerified);

  function handleBack() {
    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");
    navigate("/perfil", { replace: true });
  }

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

  useEffect(() => {
    if (!profileLoading && !user) {
      navigate("/perfil", { replace: true });
    }
  }, [profileLoading, user, navigate]);

  if (profileLoading || !user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="relative flex items-center justify-center py-6">
        <button
          type="button"
          onClick={handleBack}
          aria-label="Voltar para o perfil"
          className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-white"
        >
          <ArrowLeft size={22} color="#383838" />
        </button>

        <h1 className="text-xl font-semibold text-app-text">
          Gerenciar Categorias
        </h1>
      </header>

      <section className="mt-4 rounded-2xl bg-white p-5">
        {needsPin ? (
          <>
            <h2 className="mb-4 text-lg font-semibold text-app-text">
              Verificar PIN de acesso
            </h2>

            <PinVerificationForm
              enteredPin={enteredPin}
              accessPinError={accessPinError}
              verifyingPin={verifyingPin}
              onPinChange={setEnteredPin}
              onSubmit={handleVerifyPin}
              onCancel={handleBack}
              onForgotPin={() => navigate("/perfil/recuperar-pin")}
            />
          </>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-app-text sm:text-lg">
                Categorias
              </h2>

              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-brand-primary hover:bg-brand-hover px-3 py-2.5 text-sm font-medium text-white transition-colors sm:px-4"
              >
                <Plus size={18} />
                Nova categoria
              </button>
            </div>

            {showCreateForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
                  <h3 className="mb-4 text-base font-semibold text-app-text">
                    Criar categoria
                  </h3>

                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="category-name"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        Nome da categoria
                      </label>

                      <input
                        id="category-name"
                        type="text"
                        value={categoryName}
                        onChange={(event) =>
                          setCategoryName(event.target.value)
                        }
                        placeholder="Ex.: Escola"
                        maxLength={50}
                        required
                        className="w-full rounded-xl border border-app-border bg-white p-3"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-app-border pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setCategoryName("");
                          setShowCreateForm(false);
                        }}
                        className="rounded-xl border border-app-border bg-stone-100 px-4 py-3 font-medium text-app-text transition-colors hover:bg-stone-200"
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        className="rounded-xl bg-brand-primary hover:bg-brand-hover px-4 py-3 font-medium text-white transition-colors"
                      >
                        Salvar categoria
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading ? (
              <p className="text-sm text-gray-600">Carregando categorias...</p>
            ) : error ? (
              <p role="alert" className="text-sm text-red-700">
                {error}
              </p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-600">
                Nenhuma categoria cadastrada.
              </p>
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
                      <h3 className="font-semibold text-app-text">
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
          </>
        )}
      </section>
    </main>
  );
}
