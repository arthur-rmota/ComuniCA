import { Link } from "react-router";
import { ChevronRight, MessageSquarePlus } from "lucide-react";

export default function MessageShortcut() {
  return (
    <Link
      to="/mensagem"
      aria-label="Montar uma frase. Escolha palavras para falar"
      className="group mb-5 mt-4 flex min-h-[76px] w-full items-center gap-3 rounded-2xl border border-[#F1E4D9] bg-white px-3 py-3 shadow-[0_4px_12px_rgba(66,37,29,0.05)] transition-all active:scale-[0.98] active:bg-[#FFFAF6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#DDEFE3] text-[#347854]"
      >
        <MessageSquarePlus size={26} strokeWidth={2.2} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-base font-extrabold text-[#42251D]">
          Montar uma frase
        </span>
      </span>

      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF0E4] text-brand-primary transition-transform group-active:translate-x-1"
      >
        <ChevronRight size={20} strokeWidth={2.5} />
      </span>
    </Link>
  );
}
