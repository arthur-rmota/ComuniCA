import {
  ArrowLeft,
  Plus,
  School,
  House,
  Heart,
  Utensils,
  Gamepad2,
  BookOpen,
  Music,
  Smile,
  Bus,
  Star,
  HandHeart,
  Siren,
  Folder,
  EllipsisVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/category";
import { useProfileContext } from "../contexts/ProfileContext";
import { PinVerificationForm } from "../components/profile/PinVerificationForm";
import { cardService } from "../services/cardService";

const categoryIcons = [
  { name: "Escola", value: "school", Icon: School },
  { name: "Casa", value: "house", Icon: House },
  { name: "Coração", value: "heart", Icon: Heart },
  { name: "Alimentação", value: "utensils", Icon: Utensils },
  { name: "Brincadeiras", value: "gamepad-2", Icon: Gamepad2 },
  { name: "Leitura", value: "book-open", Icon: BookOpen },
  { name: "Música", value: "music", Icon: Music },
  { name: "Emoções", value: "smile", Icon: Smile },
  { name: "Transporte", value: "bus", Icon: Bus },
  { name: "Favoritos", value: "star", Icon: Star },
  { name: "Necessidades básicas", value: "hand-heart", Icon: HandHeart },
  { name: "Emergência", value: "siren", Icon: Siren },
  { name: "Pasta", value: "folder", Icon: Folder },
];

export default function ManageCategoriesPage() {
  const [openCategoryMenuId, setOpenCategoryMenuId] = useState<string | null>(
    null,
  );
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [deletingCategory, setDeletingCategory] = useState(false);
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState("");
  const [categoryColor, setCategoryColor] = useState(
    "var(--color-category-blue)",
  );
  const [categoryIcon, setCategoryIcon] = useState("school");

  function handleBack() {
    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");
    navigate("/perfil", { replace: true });
  }

  function handleCloseCategoryForm() {
    if (savingCategory) return;

    setCategoryName("");
    setCategoryDescription("");
    setCategoryIcon("school");
    setCategoryColor("var(--color-category-blue)");
    setCategoryFormError("");
    setEditingCategoryId(null);
    setShowCreateForm(false);
  }

  function handleStartEditCategory(category: Category) {
    setError("");
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryIcon(category.icon);
    setCategoryColor(category.color);
    setCategoryDescription(category.description);
    setCategoryFormError("");
    setShowCreateForm(true);
  }

  async function handleCreateCategory() {
    const name = categoryName.trim();

    if (!name) {
      setCategoryFormError("Informe o nome da categoria.");
      return;
    }

    const nameAlreadyExists = categories.some(
      (category) =>
        category.name.trim().toLocaleLowerCase("pt-BR") ===
        name.toLocaleLowerCase("pt-BR"),
    );

    if (nameAlreadyExists) {
      setCategoryFormError("Já existe uma categoria com esse nome.");
      return;
    }

    setSavingCategory(true);
    setCategoryFormError("");

    try {
      const newCategory: Category = {
        id: crypto.randomUUID(),
        name,
        icon: categoryIcon,
        color: categoryColor,
        description: categoryDescription.trim(),
        ownerId: user?.id ?? null,
        position:
          categories.length > 0
            ? Math.max(...categories.map((category) => category.position)) + 1
            : 1,
      };

      await categoryService.create(newCategory);

      setCategories((previous) => [...previous, newCategory]);
      setCategoryName("");
      setShowCreateForm(false);
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      setCategoryFormError(
        "Não foi possível salvar a categoria. Tente novamente.",
      );
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleUpdateCategory() {
    if (!editingCategoryId || savingCategory) return;

    const name = categoryName.trim();

    if (!name) {
      setCategoryFormError("Informe o nome da categoria.");
      return;
    }

    const nameAlreadyExists = categories.some(
      (category) =>
        category.id !== editingCategoryId &&
        category.name.trim().toLocaleLowerCase("pt-BR") ===
          name.toLocaleLowerCase("pt-BR"),
    );

    if (nameAlreadyExists) {
      setCategoryFormError("Já existe uma categoria com esse nome.");
      return;
    }

    setSavingCategory(true);
    setCategoryFormError("");

    const changes = {
      name,
      icon: categoryIcon,
      color: categoryColor,
      description: categoryDescription.trim(),
    };

    try {
      const updated = await categoryService.update(editingCategoryId, changes);

      if (updated === 0) {
        setCategoryFormError("Categoria não encontrada.");
        return;
      }

      setCategories((previous) =>
        previous.map((category) =>
          category.id === editingCategoryId
            ? { ...category, ...changes }
            : category,
        ),
      );

      setCategoryName("");
      setCategoryDescription("");
      setCategoryIcon("school");
      setCategoryColor("var(--color-category-blue)");
      setEditingCategoryId(null);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
      setCategoryFormError(
        "Não foi possível atualizar a categoria. Tente novamente.",
      );
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete || deletingCategory) return;

    const category = categoryToDelete;

    setDeletingCategory(true);
    setError("");

    try {
      const hasCards = await cardService.hasCardsInCategory(category.id);

      if (hasCards) {
        setError(
          `A categoria "${category.name}" possui símbolos associados e não pode ser excluída.`,
        );
        setCategoryToDelete(null);
        return;
      }

      const removed = await categoryService.remove(category.id);

      if (!removed) {
        setError(
          `A categoria "${category.name}" possui símbolos associados e não pode ser excluída.`,
        );
        setCategoryToDelete(null);
        return;
      }

      setCategories((previous) =>
        previous.filter((item) => item.id !== category.id),
      );

      setCategoryToDelete(null);
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
      setError("Não foi possível excluir a categoria. Tente novamente.");
      setCategoryToDelete(null);
    } finally {
      setDeletingCategory(false);
    }
  }

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
                onClick={() => {
                  setShowCreateForm(true);
                  setError("");
                }}
                className="flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-brand-primary hover:bg-brand-hover px-3 py-2.5 text-sm font-medium text-white transition-colors sm:px-4"
              >
                <Plus size={18} />
                Nova categoria
              </button>
            </div>

            {showCreateForm && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                onClick={(event) => {
                  if (event.target === event.currentTarget) {
                    handleCloseCategoryForm();
                  }
                }}
              >
                <div className="w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl">
                  <h3 className="mb-4 text-base font-semibold text-app-text">
                    {editingCategoryId ? "Editar categoria" : "Criar categoria"}
                  </h3>

                  <form
                    className="space-y-4"
                    onSubmit={(event) => {
                      event.preventDefault();

                      if (editingCategoryId) {
                        void handleUpdateCategory();
                      } else {
                        void handleCreateCategory();
                      }
                    }}
                  >
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

                    <fieldset className="space-y-3">
                      <legend className="text-sm font-medium text-app-text">
                        Ícone da categoria
                      </legend>

                      <div className="grid grid-cols-5 gap-2">
                        {categoryIcons.map(({ name, value, Icon }) => (
                          <button
                            key={value}
                            type="button"
                            aria-label={`Selecionar ícone ${name}`}
                            aria-pressed={categoryIcon === value}
                            onClick={() => setCategoryIcon(value)}
                            className={`flex aspect-square w-full items-center justify-center rounded-xl border-2 transition-colors ${
                              categoryIcon === value
                                ? "border-brand-primary bg-brand-soft text-brand-primary"
                                : "border-app-border bg-white text-app-text hover:bg-stone-100"
                            }`}
                          >
                            <Icon size={24} aria-hidden="true" />
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset className="space-y-3">
                      <legend className="text-sm font-medium text-app-text">
                        Cor da categoria
                      </legend>

                      <div className="grid grid-cols-6 gap-2">
                        {[
                          {
                            name: "Verde",
                            value: "var(--color-category-green)",
                          },
                          { name: "Azul", value: "var(--color-category-blue)" },
                          {
                            name: "Roxo",
                            value: "var(--color-category-purple)",
                          },
                          {
                            name: "Pêssego",
                            value: "var(--color-category-peach)",
                          },
                          {
                            name: "Amarelo",
                            value: "var(--color-category-yellow)",
                          },
                          { name: "Rosa", value: "var(--color-category-pink)" },
                        ].map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            aria-label={`Selecionar cor ${color.name}`}
                            aria-pressed={categoryColor === color.value}
                            onClick={() => setCategoryColor(color.value)}
                            className={`flex aspect-square w-full max-w-11 items-center justify-center justify-self-center rounded-full transition-all ${
                              categoryColor === color.value
                                ? "ring-2 ring-brand-primary ring-offset-2"
                                : "hover:scale-105"
                            }`}
                            style={{ backgroundColor: color.value }}
                          >
                            {categoryColor === color.value && (
                              <span className="text-lg font-bold text-app-text">
                                ✓
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {categoryFormError && (
                      <p role="alert" className="text-sm text-app-danger">
                        {categoryFormError}
                      </p>
                    )}

                    <div>
                      <label
                        htmlFor="category-description"
                        className="mb-2 block text-sm font-medium text-app-text"
                      >
                        Descrição (opcional)
                      </label>

                      <textarea
                        id="category-description"
                        value={categoryDescription}
                        onChange={(event) =>
                          setCategoryDescription(event.target.value)
                        }
                        placeholder="Ex.: Atividades e comunicação na escola"
                        maxLength={200}
                        rows={3}
                        className="w-full resize-none rounded-xl border border-app-border bg-white p-3 text-app-text outline-none focus:border-brand-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 border-t border-app-border pt-4">
                      <button
                        type="button"
                        onClick={handleCloseCategoryForm}
                        className="rounded-xl border border-app-border bg-stone-100 px-4 py-3 font-medium text-app-text transition-colors hover:bg-stone-200"
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        disabled={savingCategory}
                        className="rounded-xl bg-brand-primary px-4 py-3 font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {savingCategory
                          ? "Salvando..."
                          : editingCategoryId
                            ? "Salvar"
                            : "Salvar"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {categoryToDelete && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                onClick={(event) => {
                  if (
                    event.target === event.currentTarget &&
                    !deletingCategory
                  ) {
                    setCategoryToDelete(null);
                  }
                }}
              >
                <div
                  role="alertdialog"
                  aria-modal="true"
                  aria-labelledby="delete-category-title"
                  aria-describedby="delete-category-description"
                  className="w-full max-w-md rounded-2xl bg-app-surface p-6 shadow-xl"
                >
                  <h2
                    id="delete-category-title"
                    className="text-xl font-bold text-app-text"
                  >
                    Excluir categoria?
                  </h2>

                  <p
                    id="delete-category-description"
                    className="mt-3 text-sm leading-relaxed text-app-muted"
                  >
                    Tem certeza de que deseja excluir a categoria{" "}
                    <strong className="text-app-text">
                      "{categoryToDelete.name}"
                    </strong>
                    ? Esta ação não poderá ser desfeita.
                  </p>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      disabled={deletingCategory}
                      onClick={() => setCategoryToDelete(null)}
                      className="rounded-xl border border-app-border px-4 py-2.5 font-medium text-app-text transition-colors hover:bg-stone-100 disabled:opacity-50"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      disabled={deletingCategory}
                      onClick={() => void handleDeleteCategory()}
                      className="rounded-xl bg-app-danger px-4 py-2.5 font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingCategory ? "Excluindo..." : "Excluir categoria"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-app-danger"
              >
                {error}
              </p>
            )}

            {loading ? (
              <p className="text-sm text-app-muted">Carregando categorias...</p>
            ) : categories.length === 0 ? (
              <p className="text-sm text-gray-600">
                Nenhuma categoria cadastrada.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {categories.map((category, index) => (
                  <li
                    key={category.id}
                    className="relative rounded-xl border border-app-border bg-white p-3"
                  >
                    <div className="flex items-center gap-3">
                      {/* Ícone da categoria */}
                      <span
                        aria-hidden="true"
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-app-text"
                        style={{ backgroundColor: category.color }}
                      >
                        {(() => {
                          const Icon = categoryIcons.find(
                            (item) => item.value === category.icon,
                          )?.Icon;

                          return Icon ? (
                            <Icon size={26} strokeWidth={2} />
                          ) : null;
                        })()}
                      </span>

                      {/* Informações */}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-app-text">
                          {category.name}
                        </h3>

                        {category.description && (
                          <p className="mt-1 text-sm text-app-muted">
                            {category.description}
                          </p>
                        )}
                      </div>

                      {/* Menu de ações */}
                      <div className="relative shrink-0 self-center">
                        <button
                          type="button"
                          aria-label={`Opções da categoria ${category.name}`}
                          aria-expanded={openCategoryMenuId === category.id}
                          aria-haspopup="true"
                          onClick={() =>
                            setOpenCategoryMenuId((previous) =>
                              previous === category.id ? null : category.id,
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl text-app-text transition-colors hover:bg-stone-100"
                        >
                          <EllipsisVertical size={22} aria-hidden="true" />
                        </button>

                        {openCategoryMenuId === category.id && (
                          <>
                            {/* Área invisível para fechar ao clicar fora */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => {
                                setOpenCategoryMenuId(null);
                                setError("");
                              }}
                              aria-hidden="true"
                            />

                            <div
                              className={`absolute right-0 z-20 w-36 overflow-hidden rounded-xl border border-app-border bg-white p-1 shadow-lg ${
                                index === 0
                                  ? "top-full mt-2"
                                  : "bottom-full mb-2"
                              }`}
                            >
                              {" "}
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenCategoryMenuId(null);
                                  handleStartEditCategory(category);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-app-text transition-colors hover:bg-stone-100"
                              >
                                <Pencil size={16} aria-hidden="true" />
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenCategoryMenuId(null);
                                  setCategoryToDelete(category);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-app-danger transition-colors hover:bg-red-50"
                              >
                                <Trash2 size={16} aria-hidden="true" />
                                Excluir
                              </button>
                            </div>
                          </>
                        )}
                      </div>
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
