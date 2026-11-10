import { useState } from "react";
import { GlassWater, Utensils, LifeBuoy, Smile } from "lucide-react";
import type { QuickPhrase } from "../../types/quickPhrase";

const availableIcons = [
  { id: "glass-water", label: "Água", Icon: GlassWater },
  { id: "utensils", label: "Alimentação", Icon: Utensils },
  { id: "life-buoy", label: "Ajuda", Icon: LifeBuoy },
  { id: "smile", label: "Emoções", Icon: Smile },
];

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
}

function QuickPhraseForm({
  onClose,
  onSave,
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

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-phrase-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2
          id="add-phrase-title"
          className="mb-4 text-xl font-bold text-[#383838]"
        >
          {isEditing ? "Editar frase" : "Adicionar frase"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="phrase-text"
              className="mb-2 block text-sm font-semibold text-[#383838]"
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
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-[#383838] outline-none focus:border-[#FFA726]"
            />

            <p className="mt-2 text-right text-xs text-gray-500">
              {phraseText.length}/100 caracteres
            </p>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-[#383838]">
              Escolha um ícone
            </p>

            <div className="grid grid-cols-4 gap-2">
              {availableIcons.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedIcon(id)}
                  aria-label={label}
                  aria-pressed={selectedIcon === id}
                  className={`flex aspect-square items-center justify-center rounded-xl border-2 transition-colors ${
                    selectedIcon === id
                      ? "border-[#FFA726] bg-[#FFF3E0]"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <Icon size={28} color="#383838" />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-3 text-sm font-semibold text-[#383838]">
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
                    <span className="text-lg font-bold text-[#383838]">✓</span>
                  )}
                </button>
              ))}
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
              className="flex-1 rounded-xl bg-[#E5E5E5] px-4 py-3 font-semibold text-[#383838] disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSaving || !isPhraseValid}
              className="flex-1 rounded-xl bg-[#FFA726] px-4 py-3 font-semibold text-white disabled:opacity-50"
            >
              {isSaving
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Salvar frase"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuickPhraseForm;
