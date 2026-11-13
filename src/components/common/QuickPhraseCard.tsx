import type { QuickPhrase } from "../../types/quickPhrase";
import { Smile } from "lucide-react";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";

const phraseIconColors: Record<string, string> = {
  "glass-water": "#006AA6",
  utensils: "#3D7B35",
  "life-buoy": "#C62828",
  smile: "#7B1FA2",
};

interface QuickPhraseCardProps {
  phrase: QuickPhrase;
  isSpeaking: boolean;
  isSelectingToEdit?: boolean;
  onSelectToEdit?: (phrase: QuickPhrase) => void;
  onSpeak: (phrase: QuickPhrase) => void;
}

function QuickPhraseCard({
  phrase,
  isSpeaking,
  isSelectingToEdit = false,
  onSelectToEdit,
  onSpeak,
}: QuickPhraseCardProps) {
  const canEdit = phrase.userId === "local-user";

  const selectedIcon = quickPhraseIcons.find((item) => item.id === phrase.icon);

  const Icon = selectedIcon?.Icon;

  return (
    <button
      type="button"
      onClick={() => {
        if (isSelectingToEdit) {
          if (canEdit) {
            onSelectToEdit?.(phrase);
          }
          return;
        }

        onSpeak(phrase);
      }}
      aria-label={
        isSelectingToEdit ? `Editar ${phrase.text}` : `Falar: ${phrase.text}`
      }
      disabled={isSelectingToEdit && !canEdit}
      className={`relative flex min-h-40 w-full min-w-0 flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 p-4 text-center transition-all duration-200 ${
        isSelectingToEdit
          ? canEdit
            ? "border-brand-primary shadow-md active:scale-[0.98]"
            : "cursor-not-allowed border-transparent opacity-40"
          : isSpeaking
            ? "border-brand-primary shadow-md active:scale-[0.98]"
            : "border-transparent active:scale-[0.98]"
      }`}
      style={{ backgroundColor: phrase.color }}
    >
      <span aria-hidden="true">
        {Icon ? (
          <Icon
            size={52}
            strokeWidth={2.5}
            color={phraseIconColors[phrase.icon] ?? "#383838"}
          />
        ) : (
          <Smile size={52} strokeWidth={2.5} color="#383838" />
        )}
      </span>

      <span className="break-words text-sm font-semibold text-app-text">
        {phrase.text}
      </span>

      {isSpeaking && (
        <span
          role="status"
          className="flex items-center gap-1 text-xs font-medium text-[#A86400]"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-primary" />
          Falando...
        </span>
      )}
    </button>
  );
}

export default QuickPhraseCard;
