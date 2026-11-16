import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
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
  LayoutGrid,
  X,
  Check,
} from "lucide-react";
import PinAccessPage from "../../components/profile/PinAccessPage";
import { categoryService } from "../../services/categoryService";
import type { Category } from "../../types/category";
import { useProfileContext } from "../../contexts/ProfileContext";
import { PinVerificationForm } from "../../components/profile/PinVerificationForm";

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
  {
    name: "Necessidades básicas",
    value: "hand-heart",
    Icon: HandHeart,
  },
  { name: "Emergência", value: "siren", Icon: Siren },
  { name: "Pasta", value: "folder", Icon: Folder },
];

const categoryColors = [
  { name: "Verde", value: "var(--color-category-green)" },
  { name: "Azul", value: "var(--color-category-blue)" },
  { name: "Roxo", value: "var(--color-category-purple)" },
  { name: "Pêssego", value: "var(--color-category-peach)" },
  { name: "Amarelo", value: "var(--color-category-yellow)" },
  { name: "Rosa", value: "var(--color-category-pink)" },
];

const defaultColor = "var(--color-category-blue)";

export default function ManageCategoriesPage() {
  const navigate = useNavigate();

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

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );

  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("school");
  const [categoryColor, setCategoryColor] = useState(defaultColor);

  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!profileLoading && !user) {
      navigate("/perfil", { replace: true });
    }
  }, [profileLoading, user, navigate]);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const data = await categoryService.getAll();

        if (active) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);

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

  // Bloqueia a rolagem da página enquanto houver um modal.
  // A tecla Escape também fecha o modal quando não está salvando.
  useEffect(() => {
    if (!formOpen && !categoryToDelete) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || saving || deleting) return;

      if (categoryToDelete) {
        setCategoryToDelete(null);
      } else {
        setFormOpen(false);
        setEditingCategoryId(null);
        setFormError("");
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [formOpen, categoryToDelete, saving, deleting]);

  function handleBack() {
    setIsPinVerified(false);
    setEnteredPin("");
    setAccessPinError("");
    navigate("/perfil", { replace: true });
  }

  function closeForm() {
    if (saving) return;

    setFormOpen(false);
    setEditingCategoryId(null);
    setFormError("");
  }

  function openCreateForm() {
    setOpenMenuId(null);
    setEditingCategoryId(null);
    setCategoryName("");
    setCategoryDescription("");
    setCategoryIcon("school");
    setCategoryColor(defaultColor);
    setFormError("");
    setError("");
    setFormOpen(true);
  }

  function openEditForm(category: Category) {
    setOpenMenuId(null);
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryDescription(category.description);
    setCategoryIcon(category.icon);
    setCategoryColor(category.color);
    setFormError("");
    setError("");
    setFormOpen(true);
  }

  async function handleSaveCategory() {
    if (!user || needsPin || saving) return;

    const name = categoryName.trim();

    if (!name) {
      setFormError("Informe o nome da categoria.");
      return;
    }

    const duplicate = categories.some(
      (category) =>
        category.id !== editingCategoryId &&
        category.name.trim().toLocaleLowerCase("pt-BR") ===
          name.toLocaleLowerCase("pt-BR"),
    );

    if (duplicate) {
      setFormError("Já existe uma categoria com esse nome.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const changes = {
        name,
        description: categoryDescription.trim(),
        icon: categoryIcon,
        color: categoryColor,
      };

      if (editingCategoryId) {
        const updated = await categoryService.update(
          editingCategoryId,
          changes,
        );

        if (updated === 0) {
          setFormError("Categoria não encontrada.");
          return;
        }

        setCategories((current) =>
          current.map((category) =>
            category.id === editingCategoryId
              ? { ...category, ...changes }
              : category,
          ),
        );
      } else {
        const newCategory: Category = {
          id: crypto.randomUUID(),
          ...changes,
          ownerId: user.id,
          position: Math.max(0, ...categories.map((item) => item.position)) + 1,
        };

        await categoryService.create(newCategory);

        setCategories((current) => [...current, newCategory]);
      }

      setFormOpen(false);
      setEditingCategoryId(null);
    } catch (err) {
      console.error("Erro ao salvar categoria:", err);
      setFormError("Não foi possível salvar a categoria. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory() {
    if (!categoryToDelete || deleting || needsPin) return;

    const category = categoryToDelete;

    setDeleting(true);
    setError("");

    try {
      const removed = await categoryService.remove(category.id);

      if (!removed) {
        setError(
          `A categoria "${category.name}" possui cartões associados e não pode ser excluída.`,
        );
      } else {
        setCategories((current) =>
          current.filter((item) => item.id !== category.id),
        );
      }

      setCategoryToDelete(null);
    } catch (err) {
      console.error("Erro ao excluir categoria:", err);
      setError("Não foi possível excluir a categoria.");
      setCategoryToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  if (profileLoading || !user) return null;

  if (needsPin) {
    return <PinAccessPage title="Gerenciar Categorias" onBack={handleBack} />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />

      <div className="relative mx-auto w-full max-w-lg">
        {/* Cabeçalho */}
        <header className="mb-6 pt-3">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Voltar para o perfil"
            className="mb-5 flex min-h-11 items-center gap-2 rounded-2xl text-[#592B1D]"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            Voltar
          </button>

          <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-[#42251D]">
            Gerenciar Categorias
          </h1>
        </header>

        {needsPin ? (
          <section className="rounded-3xl border border-[#F5E9DF] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-extrabold text-[#42251D]">
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
          </section>
        ) : (
          <>
            {/* Apresentação */}
            <section className="mb-5 flex items-center gap-3 rounded-3xl bg-[#FFE0BD] p-4">
              <span
                aria-hidden="true"
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70"
              >
                <LayoutGrid size={30} color="#C2410C" />
              </span>

              <div>
                <h2 className="font-extrabold text-[#42251D]">
                  Organize a comunicação
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-[#775A49]">
                  Crie e personalize as categorias do aplicativo.
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-[#F5E9DF] bg-white p-4 shadow-[0_5px_14px_rgba(41,37,36,0.06)] sm:p-5">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-[#42251D]">
                    Categorias
                  </h2>

                  <p className="mt-1 text-xs font-medium text-[#80685D]">
                    {categories.length} cadastrada(s)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openCreateForm}
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-bold text-white transition-transform active:scale-95"
                >
                  <Plus size={19} aria-hidden="true" />
                  Nova categoria
                </button>
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
                <p className="text-sm text-app-muted">
                  Carregando categorias...
                </p>
              ) : categories.length === 0 ? (
                <div className="rounded-2xl bg-[#FFF9F3] p-6 text-center">
                  <Folder
                    size={40}
                    className="mx-auto mb-3 text-brand-primary"
                  />

                  <p className="text-sm font-medium text-[#80685D]">
                    Nenhuma categoria cadastrada.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {categories.map((category, index) => {
                    const selectedIcon = categoryIcons.find(
                      (item) => item.value === category.icon,
                    );

                    const Icon = selectedIcon?.Icon ?? Folder;

                    const menuOpen = openMenuId === category.id;

                    return (
                      <li
                        key={category.id}
                        className={`relative rounded-2xl border border-[#F1E4D9] bg-[#FFFCF9] p-3 ${
                          menuOpen ? "z-20" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden="true"
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
                            style={{
                              backgroundColor: category.color,
                            }}
                          >
                            <Icon size={30} strokeWidth={2.2} color="#42251D" />
                          </span>

                          <div className="min-w-0 flex-1">
                            <h3 className="break-words font-bold text-[#42251D]">
                              {category.name}
                            </h3>

                            {category.description && (
                              <p className="mt-1 break-words text-xs leading-relaxed text-[#80685D]">
                                {category.description}
                              </p>
                            )}
                          </div>

                          {/* Menu de ações */}
                          <div className="relative shrink-0">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenuId((current) =>
                                  current === category.id ? null : category.id,
                                )
                              }
                              aria-label={`Opções da categoria ${category.name}`}
                              aria-expanded={menuOpen}
                              aria-haspopup="true"
                              className="flex h-11 w-11 items-center justify-center rounded-xl text-[#592B1D] transition-colors hover:bg-[#F6ECE3]"
                            >
                              <EllipsisVertical size={23} />
                            </button>

                            {menuOpen && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  aria-hidden="true"
                                  onClick={() => setOpenMenuId(null)}
                                />

                                <div
                                  className={`absolute right-0 z-20 w-48 rounded-2xl border border-[#F1E4D9] bg-white p-2 shadow-xl ${
                                    index === categories.length - 1 && index > 0
                                      ? "bottom-full mb-2"
                                      : "top-full mt-2"
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);

                                      navigate(
                                        `/perfil/categorias/${category.id}/cartoes`,
                                        {
                                          state: {
                                            origin: "manage-categories",
                                          },
                                        },
                                      );
                                    }}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#42251D] hover:bg-[#FFF7F0]"
                                  >
                                    <LayoutGrid size={18} />
                                    Gerenciar cartões
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => openEditForm(category)}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#42251D] hover:bg-[#FFF7F0]"
                                  >
                                    <Pencil size={18} />
                                    Editar categoria
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      setCategoryToDelete(category);
                                      setError("");
                                    }}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 size={18} />
                                    Excluir
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              <button
                type="button"
                onClick={handleBack}
                className="mt-6 min-h-12 w-full rounded-xl bg-brand-primary px-4 py-3 font-bold text-white transition-colors hover:bg-brand-hover"
              >
                Confirmar
              </button>
            </section>
          </>
        )}
      </div>

      {/* Modal de criação e edição */}
      {!needsPin && formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-form-title"
            className="flex max-h-[90dvh] w-full max-w-md min-w-0 flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            {/* Cabeçalho fixo */}
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#F1E4D9] bg-[#FFF7F0] px-5 py-4">
              <h2
                id="category-form-title"
                className="text-xl font-extrabold text-[#42251D]"
              >
                {editingCategoryId ? "Editar categoria" : "Nova categoria"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Fechar formulário"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#592B1D] disabled:opacity-50"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                void handleSaveCategory();
              }}
              className="flex min-h-0 flex-1 flex-col"
            >
              {/* Conteúdo com rolagem */}
              <div className="min-h-0 space-y-5 overflow-y-auto overscroll-contain p-5">
                <div>
                  <label
                    htmlFor="category-name"
                    className="mb-2 block text-sm font-semibold text-[#42251D]"
                  >
                    Nome da categoria
                  </label>

                  <input
                    id="category-name"
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    placeholder="Ex.: Escola"
                    maxLength={50}
                    required
                    autoFocus
                    className="w-full rounded-xl border border-[#E7D5C8] bg-white p-3 text-base text-[#42251D] outline-none focus:border-brand-primary focus:ring-2 focus:ring-[#F8D8BF]"
                  />
                </div>

                <fieldset>
                  <legend className="mb-3 text-sm font-semibold text-[#42251D]">
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
                        className={`flex aspect-square items-center justify-center rounded-xl border-2 transition-colors ${
                          categoryIcon === value
                            ? "border-brand-primary bg-[#FFF0E4] text-brand-primary"
                            : "border-[#E7D5C8] bg-[#FFFCF9] text-[#42251D]"
                        }`}
                      >
                        <Icon size={25} aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="mb-3 text-sm font-semibold text-[#42251D]">
                    Cor da categoria
                  </legend>

                  <div className="grid grid-cols-6 gap-2">
                    {categoryColors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        aria-label={`Selecionar cor ${color.name}`}
                        aria-pressed={categoryColor === color.value}
                        onClick={() => setCategoryColor(color.value)}
                        className={`flex aspect-square items-center justify-center rounded-full transition-all ${
                          categoryColor === color.value
                            ? "ring-2 ring-brand-primary ring-offset-2"
                            : ""
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        {categoryColor === color.value && (
                          <Check
                            size={22}
                            strokeWidth={3}
                            color="#42251D"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label
                    htmlFor="category-description"
                    className="mb-2 block text-sm font-semibold text-[#42251D]"
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
                    className="w-full resize-none rounded-xl border border-[#E7D5C8] bg-white p-3 text-base text-[#42251D] outline-none focus:border-brand-primary focus:ring-2 focus:ring-[#F8D8BF]"
                  />
                </div>

                {formError && (
                  <p
                    role="alert"
                    className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
                  >
                    {formError}
                  </p>
                )}
              </div>

              {/* Rodapé separado da área de rolagem */}
              <div className="grid shrink-0 grid-cols-2 gap-3 border-t border-[#F1E4D9] bg-white p-4">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="min-h-12 rounded-xl border border-[#E7D5C8] bg-white px-3 py-3 font-semibold text-[#42251D] disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={saving || !categoryName.trim()}
                  className="min-h-12 rounded-xl bg-brand-primary px-3 py-3 font-bold text-white disabled:opacity-50"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmação de exclusão */}
      {!needsPin && categoryToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setCategoryToDelete(null);
            }
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-category-title"
            aria-describedby="delete-category-description"
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-[#F1E4D9] bg-[#FFF7F0] p-5">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100"
              >
                <Trash2 size={24} color="#B91C1C" />
              </span>

              <h2
                id="delete-category-title"
                className="text-xl font-extrabold text-[#42251D]"
              >
                Excluir categoria?
              </h2>
            </div>

            <div className="p-5">
              <p
                id="delete-category-description"
                className="text-sm leading-relaxed text-[#775F54]"
              >
                Deseja excluir a categoria{" "}
                <strong className="text-[#42251D]">
                  "{categoryToDelete.name}"
                </strong>
                ? Esta ação não poderá ser desfeita.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-[#F1E4D9] p-4">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setCategoryToDelete(null)}
                className="min-h-12 rounded-xl border border-[#E7D5C8] bg-white px-3 py-3 font-semibold text-[#42251D] disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => void handleDeleteCategory()}
                className="min-h-12 rounded-xl bg-red-600 px-3 py-3 font-bold text-white disabled:opacity-50"
              >
                {deleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
