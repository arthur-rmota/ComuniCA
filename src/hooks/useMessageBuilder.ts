import { useEffect, useState } from "react";
import { generateId } from "../utils/generateId";
import type { Card } from "../types/card";
import type {
  MessageBuilder,
  MessageItem,
  MoveDirection,
} from "../types/message";

const MESSAGE_DRAFT_KEY = "comunica:message-draft:v1";

function loadDraft(): MessageItem[] {
  try {
    const storedDraft = sessionStorage.getItem(MESSAGE_DRAFT_KEY);

    if (!storedDraft) return [];

    const parsed: unknown = JSON.parse(storedDraft);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is MessageItem =>
        item !== null &&
        typeof item === "object" &&
        typeof item.id === "string" &&
        typeof item.cardId === "string" &&
        typeof item.title === "string" &&
        typeof item.speechText === "string" &&
        (item.icon === null || typeof item.icon === "string") &&
        (item.image === null || typeof item.image === "string"),
    );
  } catch {
    return [];
  }
}

function saveDraft(items: MessageItem[]): void {
  try {
    if (items.length === 0) {
      sessionStorage.removeItem(MESSAGE_DRAFT_KEY);
      return;
    }

    sessionStorage.setItem(MESSAGE_DRAFT_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Não foi possível salvar o rascunho da mensagem:", error);
  }
}

export function useMessageBuilder(): MessageBuilder {
  const [items, setItems] = useState<MessageItem[]>(loadDraft);

  const [finalizedText, setFinalizedText] = useState<string | null>(null);

  // Preserva o rascunho durante a sessão.
  useEffect(() => {
    saveDraft(items);
  }, [items]);

  // Adiciona um cartão, permitindo repetições.
  function addItem(card: Card): void {
    const newItem: MessageItem = {
      id: generateId(),
      cardId: card.id,
      title: card.title,
      speechText: card.speechText,
      icon: card.icon ?? null,
      image: card.image,
    };

    setItems((current) => [...current, newItem]);
    setFinalizedText(null);
  }

  // Remove apenas a ocorrência selecionada.
  function removeItem(itemId: string): void {
    setItems((current) => current.filter((item) => item.id !== itemId));

    setFinalizedText(null);
  }

  // Move um elemento uma posição.
  function moveItem(itemId: string, direction: MoveDirection): void {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === itemId);

      if (index === -1) {
        return current;
      }

      const newIndex = direction === "left" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= current.length) {
        return current;
      }

      const updated = [...current];

      const currentItem = updated[index];
      const neighborItem = updated[newIndex];

      if (!currentItem || !neighborItem) {
        return current;
      }

      updated[index] = neighborItem;
      updated[newIndex] = currentItem;

      return updated;
    });

    setFinalizedText(null);
  }

  // Limpa a mensagem e seu rascunho.
  function clearMessage(): void {
    setItems([]);
    setFinalizedText(null);
  }

  // Finaliza a mensagem para reprodução.
  function finalizeMessage(): string | null {
    if (items.length === 0) {
      setFinalizedText(null);
      return null;
    }

    const text = items
      .map((item) => item.speechText.trim())
      .filter((text) => text.length > 0)
      .join(" ");

    if (!text) {
      setFinalizedText(null);
      return null;
    }

    setFinalizedText(text);

    return text;
  }

  return {
    items,
    finalizedText,
    addItem,
    removeItem,
    moveItem,
    clearMessage,
    finalizeMessage,
  };
}
