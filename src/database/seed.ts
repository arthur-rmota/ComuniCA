
import { db } from "./db";
import { defaultCategories } from "./seeds/categories";
import { defaultCards } from "./seeds/cards";

export async function seedDatabase(): Promise<void> {
  await db.transaction(
    "rw",
    db.categories,
    db.cards,
    async () => {
      const existingCategories = await db.categories.bulkGet(
        defaultCategories.map((category) => category.id),
      );

      const missingCategories = defaultCategories.filter(
        (_, index) => existingCategories[index] === undefined,
      );

      if (missingCategories.length > 0) {
        await db.categories.bulkAdd(missingCategories);
      }

      const existingCards = await db.cards.bulkGet(
        defaultCards.map((card) => card.id),
      );

      const missingCards = defaultCards.filter(
        (_, index) => existingCards[index] === undefined,
      );

      if (missingCards.length > 0) {
        await db.cards.bulkAdd(missingCards);
      }
    },
  );
}
