
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface ProfileMenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ProfileMenuItem({
  icon: Icon,
  label,
  onClick,
  disabled = false,
}: ProfileMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center gap-3 px-4 text-left text-app-text disabled:opacity-50"
      style={{ minHeight: 52 }}
    >
      <Icon size={21} strokeWidth={2} />

      <span className="flex-1 text-[14px] font-medium">
        {label}
      </span>

      <ChevronRight size={19} strokeWidth={2} />
    </button>
  );
}
