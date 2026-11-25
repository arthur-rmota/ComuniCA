import { useState } from "react";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";
import type { EmergencyPhrase } from "../../types/emergencyPhrase";
import AppIcon from "../common/AppIcon";

type EmergencyPhraseFormData = Pick<
  EmergencyPhrase,
  "text" | "speechText" | "icon"
>;

interface EmergencyPhraseFormProps {
  onClose: () => void;
  onSave: (data: EmergencyPhraseFormData) => Promise<void>;
  initialPhrase?: EmergencyPhrase | undefined;
}

const emergencyPictograms: Record<string, string> = {
  "life-buoy": "Ajuda",
  "phone-call": "Phone",
};

function getEmergencyIcon(icon: string): string {
  return emergencyPictograms[icon] ?? icon;
}

function EmergencyPhraseForm({
  onClose,
  onSave,
  initialPhrase,
}: EmergencyPhraseFormProps) {
  const [phraseText, setPhraseText] = useState(initialPhrase?.text ?? "");

  const [speechText, setSpeechText] = useState(initialPhrase?.speechText ?? "");

  const [selectedIcon, setSelectedIcon] = useState(
    initialPhrase?.icon ?? "alert-triangle",
  );

  const [iconSearch, setIconSearch] = useState("");

  const [selectedIconCategory, setSelectedIconCategory] = useState("Todas");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(initialPhrase);

  const isValid = phraseText.trim().length > 0 && speechText.trim().length > 0;

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

    if (!isValid || isSaving) return;

    setIsSaving(true);
    setError("");

    try {
      await onSave({
        text: phraseText.trim(),
        speechText: speechText.trim(),
        icon: selectedIcon,
      });

      onClose();
    } catch (error) {
      console.error("Erro ao salvar frase de emergência:", error);

      setError("Não foi possível salvar a frase. Tente novamente.");
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
        aria-labelledby="emergency-form-title"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-md md:max-w-2xl min-w-0 overflow-x-hidden overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:p-6"
      >
        <h2
          id="emergency-form-title"
          className="mb-4 text-xl font-bold text-app-text"
        >
          {isEditing
            ? "Editar frase de emergência"
            : "Adicionar frase de emergência"}
        </h2>

        <form onSubmit={(event) => void handleSubmit(event)}>
          {/* Texto da frase */}

          <div className="mb-6">
            <label
              htmlFor="emergency-text"
              className="mb-2 block text-sm font-semibold text-app-text"
            >
              Texto da frase <span className="text-red-600">*</span>
            </label>

            <input
              id="emergency-text"
              type="text"
              required
              maxLength={100}
              value={phraseText}
              onChange={(event) => setPhraseText(event.target.value)}
              placeholder="Ex.: Preciso de ajuda"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-app-text outline-none focus:border-[#FFA726]"
            />

            <p className="mt-2 text-right text-xs text-gray-500">
              {phraseText.length}/100 caracteres
            </p>
          </div>

          {/* Mensagem falada */}

          <div className="mb-6">
            <label
              htmlFor="emergency-speech"
              className="mb-2 block text-sm font-semibold text-app-text"
            >
              Mensagem falada <span className="text-red-600">*</span>
            </label>

            <textarea
              id="emergency-speech"
              required
              maxLength={300}
              rows={3}
              value={speechText}
              onChange={(event) => setSpeechText(event.target.value)}
              placeholder="Ex.: Por favor, preciso de ajuda!"
              className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-base text-app-text outline-none focus:border-[#FFA726]"
            />

            <p className="mt-2 text-right text-xs text-gray-500">
              {speechText.length}/300 caracteres
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
              className="mb-3 w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-app-text outline-none focus:border-[#FFA726]"
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
                      ? "border-[#FFA726] bg-[#FFF3E0] text-[#A86400]"
                      : "border-gray-200 bg-gray-50 text-app-text"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Pictogramas com rolagem interna */}

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
                    <AppIcon
                      name={getEmergencyIcon(id)}
                      size={64}
                      className="max-w-full"
                    />

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

            <div className="relative mx-auto flex min-h-44 w-full max-w-44 flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border-2 border-white/60 bg-[#F7C7BD] p-2 text-center shadow-sm">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/20"
              />

              <AppIcon
                name={getEmergencyIcon(selectedIcon)}
                size={128}
                className="relative max-w-full"
              />

              <span className="relative max-w-full break-words text-base font-extrabold leading-tight text-[#42251D]">
                {phraseText.trim() || "Sua frase"}
              </span>
            </div>

            {speechText.trim() && (
              <p className="mt-3 break-words text-center text-xs text-app-muted">
                Mensagem falada: "{speechText.trim()}"
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
              disabled={isSaving || !isValid}
              className="flex-1 rounded-xl bg-brand-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
            >
              {isSaving ? "Salvando..." : isEditing ? "Salvar" : "Salvar frase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmergencyPhraseForm;
