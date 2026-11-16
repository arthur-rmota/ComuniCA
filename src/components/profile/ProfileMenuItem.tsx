import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

type Accent = "orange" | "green" | "purple" | "blue";

interface ProfileMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  accent?: Accent;
}

const accentClasses: Record<Accent, string> = {
  orange: "bg-[#FFE0BD] text-[#C2410C]",
  green: "bg-[#DDEFE3] text-[#347854]",
  purple: "bg-[#EBE1FA] text-[#7752A4]",
  blue: "bg-[#DDEBFA] text-[#356A9C]",
};

export function ProfileMenuItem({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  accent = "orange",
}: ProfileMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex min-h-18 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[#FFF9F3] active:bg-[#FFF1E4] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span
        aria-hidden="true"
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accentClasses[accent]}`}
      >
        <Icon size={24} strokeWidth={2.2} />
      </span>

      <span className="min-w-0 flex-1 break-words text-sm font-bold text-[#42251D]">
        {label}
      </span>

      {disabled ? (
        <span className="shrink-0 text-xs font-semibold text-[#80685D]">
          Em breve
        </span>
      ) : (
        <ChevronRight
          size={20}
          className="shrink-0 text-[#9A6F5B]"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
