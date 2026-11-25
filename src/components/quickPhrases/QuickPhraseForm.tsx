import { useState } from "react";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";
import type { QuickPhrase } from "../../types/quickPhrase";
import AppIcon from "../common/AppIcon";

const availableColors = [
  "#AFE0FA",
  "#C9E2B7",
  "#FFC7C8",
  "#E7C4FF",
  "#FFE5A3",
  "#F9C6DF",
];

interface QuickPhraseFormProps {
  onClose: () => void;
  onSave: (phrase: Omit<QuickPhrase, "id">) => Promise<void>;
  initialPhrase?: QuickPhrase;
  onDelete?: () => void;
}

function QuickPhraseForm({
  onClose,
  onSave,
  onDelete,
  initialPhrase,
}: QuickPhraseFormProps) {
  const [phraseText, setPhraseText] = useState(initialPhrase?.text ?? "");

  const [selectedIcon, setSelectedIcon] = useState(
    initialPhrase?.icon ?? "smile",
  );

  const [selectedColor, setSelectedColor] = useState(
    initialPhrase?.color ?? "#AFE0FA",
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [iconSearch, setIconSearch] = useState("");
  const [selectedIconCategory, setSelectedIconCategory] = useState("Todas");

  const isPhraseValid = phraseText.trim().length > 0;

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = phraseText.trim();

    if (!text) {
      setError("Digite uma frase antes de salvar.");
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    setError("");

    try {
      await onSave({
        userId: initialPhrase?.userId ?? "local-user",
        text,
        categoryId: initialPhrase?.categoryId ?? null,
        position: initialPhrase?.position ?? 0,
        icon: selectedIcon,
        color: selectedColor,
      });

      onClose();
    } catch {
      setError("Não foi possível salvar a frase. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  const isEditing = Boolean(initialPhrase);

  const iconCategories = [
    "Todas",
    ...new Set(quickPhraseIcons.map((item) => item.category)),
  ];

  const filteredIcons = quickPhraseIcons.filter((item) => {
    const matchesSearch = item.label
      .toLocaleLowerCase("pt-BR")
      .includes(iconSearch.trim().toLocaleLowerCase("pt-BR"));

    const matchesCategory =
      selectedIconCategory === "Todas" ||
      item.category === selectedIconCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-phrase-title"
        className="min-w-0 max-h-[calc(100dvh-2rem)] w-full max-w-md md:max-w-2xl overflow-x-hidden overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6"
      >
        <h2
          id="add-phrase-title"
          className="mb-4 text-xl font-bold text-app-text"
        >
          {isEditing ? "Editar frase" : "Adicionar frase"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="phrase-text"
              className="mb-2 block text-sm font-semibold text-app-text"
            >
              Texto da frase <span className="text-red-600">*</span>
            </label>

            <input
              id="phrase-text"
              type="text"
              required
              aria-required="true"
              value={phraseText}
              onChange={(event) => setPhraseText(event.target.value)}
              placeholder="Ex.: Quero brincar"
              maxLength={100}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-app-text outline-none focus:border-[#FFA726]"
            />

            <p className="mt-2 text-right text-xs text-gray-500">
              {phraseText.length}/100 caracteres
            </p>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-app-text">
              Escolha um ícone
            </p>

            <input
              type="search"
              value={iconSearch}
              onChange={(event) => setIconSearch(event.target.value)}
              placeholder="Pesquisar ícone..."
              aria-label="Pesquisar ícones"
              className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-app-text outline-none focus:border-[#FFA726]"
            />

            <div
              role="group"
              aria-label="Filtrar ícones por categoria"
              className="mb-3 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-2"
            >
              {iconCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedIconCategory(category)}
                  aria-pressed={selectedIconCategory === category}
                  className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                    selectedIconCategory === category
                      ? "border-[#FFA726] bg-[#FFF3E0] text-[#A86400]"
                      : "border-gray-200 bg-gray-50 text-app-text"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="max-h-56 md:max-h-80 overflow-x-hidden overflow-y-auto overscroll-y-contain touch-pan-y rounded-xl border border-gray-200 p-2">
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6 md:gap-3">
                {filteredIcons.map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedIcon(id)}
                    aria-label={label}
                    aria-pressed={selectedIcon === id}
                    title={label}
                    className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl border-2 p-1 transition-colors focus-visible:outline-2 focus-visible:outline-brand-primary ${
                      selectedIcon === id
                        ? "border-[#FFA726] bg-[#FFF3E0]"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <AppIcon name={id} size={64} className="max-w-full" />

                    <span className="max-w-full break-words text-center text-[10px] font-semibold leading-tight text-[#592B1D]">
                      {label}
                    </span>
                  </button>
                ))}

                {filteredIcons.length === 0 && (
                  <p className="col-span-full w-full py-6 text-center text-sm text-gray-500">
                    Nenhum ícone encontrado.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-app-text">
              Escolha uma cor
            </p>

            <div className="grid grid-cols-6 gap-2">
              {availableColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Selecionar cor ${color}`}
                  aria-pressed={selectedColor === color}
                  className={`flex aspect-square items-center justify-center rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-[#383838] scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {selectedColor === color && (
                    <span className="text-lg font-bold text-app-text">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-app-text">
              Prévia do cartão
            </p>

            <div
              className="relative mx-auto flex min-h-44 w-full max-w-44 flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border-2 border-white/60 p-2 text-center shadow-sm"
              style={{
                backgroundColor: selectedColor,
              }}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/15"
              />

              <AppIcon
                name={selectedIcon}
                size={128}
                className="relative max-w-full"
              />

              <span className="relative max-w-full break-words text-base font-extrabold leading-tight text-[#42251D]">
                {phraseText.trim() || "Sua frase"}
              </span>
            </div>
          </div>

          {error && (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-xl bg-stone-100 px-4 py-3 font-semibold text-app-text disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving || !isPhraseValid}
              className="flex-1 rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : isEditing ? "Salvar" : "Salvar frase"}
            </button>
          </div>
        </form>

        {isEditing && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isSaving}
            className="mt-4 w-full rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            Excluir frase
          </button>
        )}
      </div>
    </div>
  );
}

export default QuickPhraseForm;
