import type { QuickPhrase } from "../../types/quickPhrase";
import { GlassWater, Utensils, Smile, LifeBuoy, Star } from "lucide-react";

const phraseIcons = {
  "glass-water": GlassWater,
  utensils: Utensils,
  "life-buoy": LifeBuoy,
  smile: Smile,
};

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
  isUpdatingFavorite: boolean;
  onSpeak: (phrase: QuickPhrase) => void;
  onToggleFavorite: (phrase: QuickPhrase) => void;
}

function QuickPhraseCard({
  phrase,
  isFavorite,
  isSpeaking,
  isUpdatingFavorite,
  onSpeak,
  onToggleFavorite,
}: QuickPhraseCardProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onSpeak(phrase)}
        className={`relative flex min-h-40 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border-2 p-4 text-center transition-all duration-200 active:scale-[0.98] ${
          isSpeaking ? "border-[#FFA726] shadow-md" : "border-transparent"
        }`}
        style={{ backgroundColor: phrase.color }}
      >
        <span aria-hidden="true">
          {(() => {
            const Icon = phraseIcons[phrase.icon as keyof typeof phraseIcons];

            return Icon ? (
              <Icon
                size={52}
                strokeWidth={2.5}
                color={phraseIconColors[phrase.icon] ?? "#383838"}
              />
            ) : (
              <Smile size={52} strokeWidth={2.5} />
            );
          })()}
        </span>

        <span className="text-sm font-semibold text-[#383838]">
          {phrase.text}
        </span>

        {isSpeaking && (
          <span
            role="status"
            className="flex items-center gap-1 text-xs font-medium text-[#A86400]"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#FFA726]" />
            Falando...
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => onToggleFavorite(phrase)}
        disabled={isUpdatingFavorite}
        aria-label={
          isFavorite
            ? `Desfavoritar ${phrase.text}`
            : `Favoritar ${phrase.text}`
        }
        aria-pressed={isFavorite}
        className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-[#383838] shadow-sm disabled:opacity-50"
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
