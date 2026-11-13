import { useState } from "react";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";
import type { Card } from "../../types/card";

export interface CardFormData {
  title: string;
  speechText: string;
  altText: string;
  image: string | null;
  icon: string;
}

interface CardFormProps {
  onClose: () => void;
  onSave: (data: CardFormData) => Promise<void>;
  initialCard?: Card;
}

export default function CardForm({
  onClose,
  onSave,
  initialCard,
}: CardFormProps) {
  const [title, setTitle] = useState(initialCard?.title ?? "");
  const [speechText, setSpeechText] = useState(initialCard?.speechText ?? "");
  const [selectedIcon, setSelectedIcon] = useState(
    initialCard?.icon ?? "message-circle",
  );
  const [iconSearch, setIconSearch] = useState("");
  const [selectedIconCategory, setSelectedIconCategory] = useState("Todas");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const isCardValid = title.trim().length > 0 && speechText.trim().length > 0;

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

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isCardValid || isSaving) return;

    setIsSaving(true);
    setError("");

    try {
      await onSave({
        title: title.trim(),
        speechText: speechText.trim(),
        icon: selectedIcon,
        image: null,
        altText: "",
      });

      onClose();
    } catch (error) {
      console.error("Erro ao salvar cartão:", error);
      setError("Não foi possível salvar o cartão.");
    } finally {
      setIsSaving(false);
    }
  }

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
        aria-labelledby="card-form-title"
        className="min-w-0 max-h-[90dvh] w-full max-w-md overflow-x-hidden overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6"
      >
        <h2
          id="card-form-title"
          className="mb-4 text-xl font-bold text-app-text"
        >
          {initialCard ? "Editar cartãao" : "Adicionar cartão"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="card-title"
              className="mb-2 block text-sm font-semibold text-app-text"
            >
              Nome do cartão <span className="text-red-600">*</span>
            </label>

            <input
              id="card-title"
              type="text"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Água"
              maxLength={60}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-app-text outline-none focus:border-brand-primary"
            />

            <p className="mt-2 text-right text-xs text-gray-500">
              {title.length}/60 caracteres
            </p>
          </div>

          <div className="mb-6">
            <label
              htmlFor="card-speech"
              className="mb-2 block text-sm font-semibold text-app-text"
            >
              Texto para fala <span className="text-red-600">*</span>
            </label>

            <input
              id="card-speech"
              type="text"
              required
              value={speechText}
              onChange={(event) => setSpeechText(event.target.value)}
              placeholder="Ex.: Quero beber água"
              maxLength={200}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-app-text outline-none focus:border-brand-primary"
            />

            <p className="mt-2 text-right text-xs text-gray-500">
              {speechText.length}/200 caracteres
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
              className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-app-text outline-none focus:border-brand-primary"
            />

            <div
              role="group"
              aria-label="Filtrar ícones por categoria"
              className="mb-3 flex w-full min-w-0 gap-2 overflow-x-auto pb-2"
            >
              {iconCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedIconCategory(category)}
                  aria-pressed={selectedIconCategory === category}
                  className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
                    selectedIconCategory === category
                      ? "border-brand-primary bg-brand-soft text-brand-primary"
                      : "border-gray-200 bg-gray-50 text-app-text"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-200 p-2">
              <div className="grid grid-cols-4 gap-2">
                {filteredIcons.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedIcon(id)}
                    aria-label={label}
                    aria-pressed={selectedIcon === id}
                    className={`flex aspect-square items-center justify-center rounded-xl border-2 transition-colors ${
                      selectedIcon === id
                        ? "border-brand-primary bg-brand-soft"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <Icon size={28} color="#383838" aria-hidden="true" />
                  </button>
                ))}

                {filteredIcons.length === 0 && (
                  <p className="col-span-full py-6 text-center text-sm text-gray-500">
                    Nenhum ícone encontrado.
                  </p>
                )}
              </div>
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
              disabled={isSaving || !isCardValid}
              className="flex-1 rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
            >
              {isSaving
                ? "Salvando..."
                : initialCard
                  ? "Salvar"
                  : "Salvar cartão"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
