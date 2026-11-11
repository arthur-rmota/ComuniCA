
import { db } from "../database/db";
import type { Card } from "../types/card";

export const cardService = {
  async create(card: Card): Promise<string> {
    return db.cards.add(card);
  },

  async getById(id: string): Promise<Card | undefined> {
    return db.cards.get(id);
  },

  async getAll(): Promise<Card[]> {
    return db.cards.toArray();
  },

  async getByCategory(categoryId: string): Promise<Card[]> {
    return db.cards
      .where("categoryId")
      .equals(categoryId)
      .filter((card) => card.isActive)
      .toArray();
  },

  async update(
    id: string,
    changes: Partial<Card>,
  ): Promise<number> {
    return db.cards.update(id, changes);
  },

  async remove(id: string): Promise<void> {
    await db.cards.delete(id);
  },
};

// Compatibilidade com os componentes existentes.
export async function getCards(): Promise<Card[]> {
  const cards = await cardService.getAll();

  return cards.filter((card) => card.isActive);
}
