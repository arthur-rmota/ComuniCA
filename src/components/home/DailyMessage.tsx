
import { Volume2 } from "lucide-react";
import { speak } from "../../utils/speech";

function DailyMessage() {
  const hour = new Date().getHours();

  let greeting = "Boa noite!";
  let emoji = "🌙";

  if (hour >= 5 && hour < 12) {
    greeting = "Bom dia!";
    emoji = "☀️";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Boa tarde!";
    emoji = "🌤️";
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#FFE0BD] p-4 shadow-[0_5px_16px_rgba(194,65,12,0.08)]">
      <div
        aria-hidden="true"
        className="absolute -right-5 -top-8 h-24 w-24 rounded-full bg-white/25"
      />

      <div className="relative flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-3xl"
        >
          {emoji}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-extrabold text-[#592B1D]">
            {greeting}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => speak(greeting)}
          aria-label={`Ouvir: ${greeting}`}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-brand-primary shadow-sm transition-transform active:scale-95"
        >
          <Volume2 size={24} strokeWidth={2.5} />
        </button>
      </div>
    </section>
  );
}

export default DailyMessage;
