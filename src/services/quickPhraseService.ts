import { db } from "../database/db";
import type { QuickPhrase } from "../types/quickPhrase";

export async function getQuickPhrases(): Promise<QuickPhrase[]> {
  return db.quickPhrases.orderBy("position").toArray();
}

export async function createQuickPhrase(
  phrase: Omit<QuickPhrase, "id">,
): Promise<QuickPhrase> {
  const newPhrase: QuickPhrase = {
    ...phrase,
    id: crypto.randomUUID(),
  };

  await db.quickPhrases.add(newPhrase);

  return newPhrase;
}

export async function updateQuickPhrase(
  id: string,
  changes: Partial<Omit<QuickPhrase, "id">>,
): Promise<QuickPhrase> {
  const updated = await db.quickPhrases.update(id, changes);

  if (updated === 0) {
    throw new Error("Frase rápida não encontrada.");
  }

  const updatedPhrase = await db.quickPhrases.get(id);

  if (!updatedPhrase) {
    throw new Error("Frase rápida não encontrada.");
  }

  return updatedPhrase;
}

export async function deleteQuickPhrase(id: string): Promise<void> {
  const phrase = await db.quickPhrases.get(id);

  if (!phrase) {
    throw new Error("Frase rápida não encontrada.");
  }

  await db.quickPhrases.delete(id);
}

export async function recordQuickPhraseUse(id: string): Promise<number> {
  return db.transaction("rw", db.quickPhrases, async () => {
    const phrase = await db.quickPhrases.get(id);

    if (!phrase) {
      throw new Error("Frase não encontrada.");
    }

    const nextCount = (phrase.usageCount ?? 0) + 1;

    await db.quickPhrases.update(id, {
      usageCount: nextCount,
    });

    return nextCount;
  });
}
