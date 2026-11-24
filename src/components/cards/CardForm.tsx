import { useState } from "react";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";
import type { Card } from "../../types/card";
import AppIcon from "../common/AppIcon";

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
          {initialCard ? "Editar cartão" : "Adicionar cartão"}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Nome do cartão */}

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

          {/* Texto para fala */}

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

          {/* Seletor de pictogramas */}

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

            {/* Filtros por categoria */}

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
                      ? "border-brand-primary bg-brand-soft text-brand-primary"
                      : "border-gray-200 bg-gray-50 text-app-text"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Área de pictogramas com rolagem interna */}

            <div className="max-h-56 overflow-x-hidden overflow-y-auto overscroll-y-contain touch-pan-y rounded-xl border border-gray-200 p-2">
              <div className="grid grid-cols-4 gap-2">
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
                        ? "border-brand-primary bg-brand-soft"
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
                  <p className="col-span-full py-6 text-center text-sm text-gray-500">
                    Nenhum ícone encontrado.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Prévia do cartão */}

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-app-text">
              Prévia do cartão
            </p>

            <div className="relative mx-auto flex min-h-44 w-full max-w-44 flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border-2 border-white/60 bg-[#DDEBFA] p-2 text-center shadow-sm">
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
                {title.trim() || "Seu cartão"}
              </span>
            </div>

            {speechText.trim() && (
              <p className="mt-3 break-words text-center text-xs text-app-muted">
                Texto para fala: "{speechText.trim()}"
              </p>
            )}
          </div>

          {/* Mensagem de erro */}

          {error && (
            <p role="alert" className="mb-4 text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Botões do formulário */}

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
