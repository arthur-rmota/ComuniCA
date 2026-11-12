import type { QuickPhrase } from "../../types/quickPhrase";
import { Smile, Star } from "lucide-react";
import { quickPhraseIcons } from "../../constants/quickPhraseIcons";

const phraseIconColors: Record<string, string> = {
  "glass-water": "#006AA6",
  utensils: "#3D7B35",
  "life-buoy": "#C62828",
  smile: "#7B1FA2",
};

interface QuickPhraseCardProps {
  phrase: QuickPhrase;
  isFavorite: boolean;
  isSpeaking: boolean;
  isSelectingToEdit?: boolean;
  onSelectToEdit?: (phrase: QuickPhrase) => void;
  isUpdatingFavorite: boolean;
  onSpeak: (phrase: QuickPhrase) => void;
  onToggleFavorite: (phrase: QuickPhrase) => void;
}

function QuickPhraseCard({
  phrase,
  isFavorite,
  isSpeaking,
  isSelectingToEdit = false,
  onSelectToEdit,
  isUpdatingFavorite,
  onSpeak,
  onToggleFavorite,
}: QuickPhraseCardProps) {
  const canEdit = phrase.userId === "local-user";
  const selectedIcon = quickPhraseIcons.find((item) => item.id === phrase.icon);
  const Icon = selectedIcon?.Icon;
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          if (isSelectingToEdit) {
            if (phrase.userId === "local-user") {
              onSelectToEdit?.(phrase);
            }
            return;
          }

          onSpeak(phrase);
        }}
        className={`relative flex min-h-40 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 p-4 text-center transition-all duration-200 ${
          isSelectingToEdit
            ? canEdit
              ? "cursor-pointer border-[#FFA726] shadow-md active:scale-[0.98]"
              : "cursor-not-allowed border-transparent opacity-40"
            : isSpeaking
              ? "border-[#FFA726] shadow-md active:scale-[0.98]"
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

        <span className="text-sm font-semibold text-app-text">
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

      <button
        type="button"
        onClick={() => onToggleFavorite(phrase)}
        disabled={isUpdatingFavorite || isSelectingToEdit}
        aria-label={
          isFavorite
            ? `Desfavoritar ${phrase.text}`
            : `Favoritar ${phrase.text}`
        }
        aria-pressed={isFavorite}
        className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-app-text shadow-sm disabled:opacity-50"
      >
        <Star
          size={20}
          fill={isFavorite ? "#FFA726" : "none"}
          color="#FFA726"
        />
      </button>
    </div>
  );
}

export default QuickPhraseCard;
