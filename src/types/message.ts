
import type { Card } from "./card";

export interface MessageItem {
  id: string;
  cardId: string;
  title: string;
  speechText: string;
  icon: string | null;
  image: string | null;
}

export type MoveDirection = "left" | "right";

export interface MessageBuilder {
  items: MessageItem[];
  finalizedText: string | null;

  addItem: (card: Card) => void;
  removeItem: (itemId: string) => void;
  moveItem: (itemId: string, direction: MoveDirection) => void;
  clearMessage: () => void;
  finalizeMessage: () => string | null;
}
