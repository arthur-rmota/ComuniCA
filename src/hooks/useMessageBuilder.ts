
import { useState } from "react";
import type { Card } from "../types/card";
import type { MessageItem } from "../types/message";

export function useMessageBuilder() {
  const [items, setItems] = useState<MessageItem[]>([]);
  const [finalizedText, setFinalizedText] = useState("");

  // Adiciona um cartao a mensagem
  function addItem(card: Card) {
    const newItem: MessageItem = {
      id: crypto.randomUUID(),
      card,
    };

    setItems((current) => [...current, newItem]);
    setFinalizedText("");
  }

  // Remove apenas o elemento selecionado
  function removeItem(id: string) {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
    setFinalizedText("");
  }

  // Move um elemento para outra posição
  function moveItem(id: string, direction: "left" | "right") {
    setItems((current) => {
      const index = current.findIndex((item) => item.id === id);
      if (index === -1) return current;

      const newIndex = direction === "left" ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= current.length) {
        return current;
      }

      const updated = [...current];

      [updated[index], updated[newIndex]] = [
        updated[newIndex],
        updated[index],
      ];

      return updated;
    });

    setFinalizedText("");
  }

  // Limpa todos os elementos
  function clearMessage() {
    setItems([]);
    setFinalizedText("");
  }

  // Finaliza a mensagem e retorna o texto
  function finalizeMessage(): string | null {
    if (items.length === 0) {
      setFinalizedText("");
      return null;
    }

    const text = items
      .map((item) => item.card.speechText.trim())
      .filter((text) => text.length > 0)
      .join(" ");

    if (!text) {
      setFinalizedText("");
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
