
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

  const selectedIcon = quickPhraseIcons.find(
    (item) => item.id === phrase.icon,
  );

  const Icon = selectedIcon?.Icon ?? Smile;

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
        isSelectingToEdit
          ? `Editar ${phrase.text}`
          : `Falar: ${phrase.text}`
      }
      disabled={isSelectingToEdit && !canEdit}
      className={`group relative flex min-h-44 w-full min-w-0 flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border-2 p-4 text-center transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary ${
        isSelectingToEdit && !canEdit
          ? "cursor-not-allowed border-white/60 opacity-40"
          : isSpeaking || isSelectingToEdit
            ? "border-brand-primary shadow-[0_5px_18px_rgba(194,65,12,0.18)] active:scale-[0.97]"
            : "border-white/60 shadow-[0_5px_14px_rgba(41,37,36,0.07)] active:scale-[0.97]"
      }`}
      style={{
        backgroundColor: phrase.color,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/15"
      />

      <Icon
        size={58}
        strokeWidth={2.2}
        color={phraseIconColors[phrase.icon] ?? "#42251D"}
        aria-hidden="true"
        className="relative"
      />

      <span className="relative break-words text-base font-extrabold leading-tight text-[#42251D]">
        {phrase.text}
      </span>

      {isSpeaking && (
        <span
          role="status"
          className="relative flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-bold text-[#9A3412]"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-primary" />
          Falando...
        </span>
      )}
    </button>
  );
}

export default QuickPhraseCard;
