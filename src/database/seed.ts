import { db } from "./db";
import { defaultCategories } from "./seeds/categories";
import { defaultCards } from "./seeds/cards";
import { defaultQuickPhrases } from "./seeds/quickPhrases";
import { defaultEmergencyPhrases } from "./seeds/emergencyPhrases";
import { defaultRoutineSections } from "./seeds/routineSections";

export async function seedDatabase(): Promise<void> {
  await db.transaction(
    "rw",
    [
      "categories",
      "cards",
      "quickPhrases",
      "seedMetadata",
      "emergencyPhrases",
      "routineSections",
    ],
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

      // Migração: manter apenas quatro frases rápidas fixas.
      const quickPhrasesMigration =
        await db.seedMetadata.get("quick-phrases-v2");

      if (!quickPhrasesMigration) {
        const fixedPhraseIds = new Set(
          defaultQuickPhrases.map((phrase) => phrase.id),
        );

        const existingPhrases = await db.quickPhrases.toArray();

        // Transforma antigas frases predefinidas em personalizadas.
        for (const phrase of existingPhrases) {
          if (fixedPhraseIds.has(phrase.id)) {
            continue;
          }

          if (phrase.userId === null) {
            await db.quickPhrases.update(phrase.id, {
              userId: "local-user",
            });
          }
        }

        // Insere ou atualiza as quatro frases fixas.
        for (const defaultPhrase of defaultQuickPhrases) {
          const existingPhrase = await db.quickPhrases.get(defaultPhrase.id);

          if (existingPhrase) {
            await db.quickPhrases.put(defaultPhrase);
          } else {
            await db.quickPhrases.add(defaultPhrase);
          }
        }

        // Registra que a migração foi concluída.
        await db.seedMetadata.put({
          key: "quick-phrases-v2",
        });
      }

      // Sincroniza as quatro frases rápidas fixas com o seed.
      // As frases personalizadas não são modificadas.
      for (const defaultPhrase of defaultQuickPhrases) {
        const existingPhrase = await db.quickPhrases.get(defaultPhrase.id);

        if (!existingPhrase) {
          await db.quickPhrases.add(defaultPhrase);
          continue;
        }

        await db.quickPhrases.update(defaultPhrase.id, {
          userId: null,
          text: defaultPhrase.text,
          categoryId: defaultPhrase.categoryId,
          position: defaultPhrase.position,
          icon: defaultPhrase.icon,
          color: defaultPhrase.color,
        });
      }

      // Inicializa as frases de emergência apenas uma vez.
      // Edições e exclusões posteriores são preservadas.
      const emergencyInitialized = await db.seedMetadata.get(
        "emergency-phrases-initialized",
      );

      if (!emergencyInitialized) {
        for (const phrase of defaultEmergencyPhrases) {
          const existingPhrase = await db.emergencyPhrases.get(phrase.id);

          if (!existingPhrase) {
            await db.emergencyPhrases.add(phrase);
          }
        }

        await db.seedMetadata.put({
          key: "emergency-phrases-initialized",
        });
      }

      // Inicializa as seções da rotina apenas uma vez.
      const routineInitialized = await db.seedMetadata.get(
        "routine-sections-initialized",
      );

      if (!routineInitialized) {
        for (const section of defaultRoutineSections) {
          const existingSection = await db.routineSections.get(section.id);

          if (!existingSection) {
            await db.routineSections.add(section);
          }
        }

        await db.seedMetadata.put({
          key: "routine-sections-initialized",
        });
      }
    },
  );
}
