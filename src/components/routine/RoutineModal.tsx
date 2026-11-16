import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

type RoutineModalProps = {
  title: string;
  titleId: string;
  onClose: () => void;
  busy?: boolean;
  destructive?: boolean;
  children: ReactNode;
  footer?: ReactNode;
};

/** Modal usado para cadastrar, editar e confirmar exclusões na Rotina. */
export default function RoutineModal({
  title,
  titleId,
  onClose,
  busy = false,
  destructive = false,
  children,
  footer,
}: RoutineModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !busy) {
        event.preventDefault();
        onClose();
      }

      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );

      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focused = document.activeElement;

      if (event.shiftKey && (focused === first || !dialogRef.current?.contains(focused))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (focused === last || !dialogRef.current?.contains(focused))) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [busy, onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#271D18]/45 p-3 sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role={destructive ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md min-w-0 flex-col overflow-hidden rounded-3xl border border-[#E8DDD5] bg-white shadow-[0_20px_60px_rgba(41,37,36,0.22)]"
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#EEE4DC] bg-white px-5 py-4">
          <h2 id={titleId} className="min-w-0 text-xl font-extrabold text-[#42251D]">
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            disabled={busy}
            onClick={onClose}
            aria-label="Fechar janela"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF4EC] text-[#592B1D] transition-colors hover:bg-[#FFE0BD] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary disabled:opacity-50"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain bg-white px-5 py-5">
          {children}
        </div>

        {footer && (
          <div className="shrink-0 border-t border-[#EEE4DC] bg-white px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
