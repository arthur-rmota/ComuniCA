import { useState } from "react";
import type { Card } from "../types/card";
import type {
  MessageBuilder,
  MessageItem,
  MoveDirection,
} from "../types/message";

export function useMessageBuilder(): MessageBuilder {
  const [items, setItems] = useState<MessageItem[]>([]);
  const [finalizedText, setFinalizedText] = useState<string | null>(null);

  // Adiciona um cartão à mensagem, permitindo repetições
  function addItem(card: Card): void {
    const newItem: MessageItem = {
      id: crypto.randomUUID(),
      cardId: card.id,
      title: card.title,
      speechText: card.speechText,
      icon: card.icon ?? null,
      image: card.image,
    };

    setItems((current) => [...current, newItem]);
    setFinalizedText(null);
  }

  // Remove apenas a ocorrência selecionada
  function removeItem(itemId: string): void {
    setItems((current) => current.filter((item) => item.id !== itemId));

    setFinalizedText(null);
  }

  // Move um elemento uma posição para esquerda ou direita

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

  // Limpa todos os elementos da mensagem
  function clearMessage(): void {
    setItems([]);
    setFinalizedText(null);
  }

  // Finaliza a mensagem e retorna o texto para reprodução
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
