import { db } from "./db";
import { defaultCategories } from "./seeds/categories";
import { defaultCards } from "./seeds/cards";
import { defaultQuickPhrases } from "./seeds/quickPhrases";

export async function seedDatabase(): Promise<void> {
  await db.transaction(
    "rw",
    db.categories,
    db.cards,
    db.quickPhrases,
    db.seedMetadata,
    async () => {
      const categoriesInitialized = await db.seedMetadata.get(
        "categories-initialized",
      );

      if (!categoriesInitialized) {
        const existingCategories = await db.categories.bulkGet(
          defaultCategories.map((category) => category.id),
        );

        const missingCategories = defaultCategories.filter(
          (_, index) => existingCategories[index] === undefined,
        );

        if (missingCategories.length > 0) {
          await db.categories.bulkAdd(missingCategories);
        }

        await db.seedMetadata.put({ key: "categories-initialized" });
      }

      const cardsInitialized = await db.seedMetadata.get("cards-initialized");

      if (!cardsInitialized) {
        const existingCards = await db.cards.bulkGet(
          defaultCards.map((card) => card.id),
        );

        const missingCards = defaultCards.filter(
          (_, index) => existingCards[index] === undefined,
        );

        if (missingCards.length > 0) {
          await db.cards.bulkAdd(missingCards);
        }

        await db.seedMetadata.put({ key: "cards-initialized" });
      }

      const quickPhrasesInitialized = await db.seedMetadata.get(
        "quick-phrases-initialized",
      );

      if (!quickPhrasesInitialized) {
        const existingQuickPhrases = await db.quickPhrases.bulkGet(
          defaultQuickPhrases.map((phrase) => phrase.id),
        );

        const missingQuickPhrases = defaultQuickPhrases.filter(
          (_, index) => existingQuickPhrases[index] === undefined,
        );

        if (missingQuickPhrases.length > 0) {
          await db.quickPhrases.bulkAdd(missingQuickPhrases);
        }

        await db.seedMetadata.put({ key: "quick-phrases-initialized" });
      }
    },
  );
}
