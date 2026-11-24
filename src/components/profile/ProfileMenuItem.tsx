import { ChevronRight } from "lucide-react";
import AppIcon from "../common/AppIcon";

type Accent = "orange" | "green" | "purple" | "blue";

interface ProfileMenuItemProps {
  icon: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  accent?: Accent;
}

const accentClasses: Record<Accent, string> = {
  orange: "bg-[#FFE0BD]",
  green: "bg-[#DDEFE3]",
  purple: "bg-[#EBE1FA]",
  blue: "bg-[#DDEBFA]",
};

export function ProfileMenuItem({
  icon,
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
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${accentClasses[accent]}`}
      >
        <AppIcon name={icon} size={60} />
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
