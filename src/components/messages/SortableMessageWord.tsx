import { GripVertical, X } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { MessageItem } from "../../types/message";
import AppIcon from "../common/AppIcon";

interface SortableMessageWordProps {
  item: MessageItem;
  onRemove: () => void;
}

export default function SortableMessageWord({
  item,
  onRemove,
}: SortableMessageWordProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition: isDragging ? undefined : transition,
        position: "relative",
        zIndex: isDragging ? 50 : 1,
        scale: isDragging ? 1.03 : 1,
      }}
      className={`inline-flex max-w-full items-center gap-1 rounded-2xl border-2 p-1 text-[#592B1D] ${
        isDragging
          ? "border-brand-primary bg-[#FFE7D4] shadow-[0_12px_28px_rgba(66,37,29,0.22)]"
          : "border-[#F4D4BD] bg-[#FFF0E4] shadow-[0_2px_5px_rgba(66,37,29,0.05)]"
      }`}
    >
      <button
        ref={setActivatorNodeRef}
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Arrastar ${item.title} para mudar a ordem`}
        className="flex h-12 w-8 shrink-0 touch-none select-none items-center justify-center rounded-xl text-[#A75D35] focus-visible:outline-2 focus-visible:outline-brand-primary"
        style={{
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
        onContextMenu={(event) => event.preventDefault()}
      >
        <GripVertical size={23} strokeWidth={2.5} aria-hidden="true" />
      </button>

      <div className="flex min-w-0 max-w-28 flex-col items-center justify-center gap-1 py-1 text-center">
        {item.image ? (
          <img
            src={item.image}
            alt=""
            width={64}
            height={64}
            draggable={false}
            className="h-16 w-16 select-none object-contain"
          />
        ) : (
          <AppIcon name={item.icon || "MessageCircle"} size={64} />
        )}

        <span className="select-none break-words px-1 text-sm font-extrabold leading-tight">
          {item.title}
        </span>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover ${item.title} da frase`}
        className="flex h-12 w-8 shrink-0 items-center justify-center rounded-xl text-[#A1442D] active:bg-[#FFE0D0] focus-visible:outline-2 focus-visible:outline-brand-primary"
      >
        <X size={21} strokeWidth={2.3} aria-hidden="true" />
      </button>
    </div>
  );
}
