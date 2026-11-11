
import { db } from "../database/db";
import type { QuickPhraseFavorite } from "../types/quickPhraseFavorite";

export async function getQuickPhraseFavorites(
  userId: string,
): Promise<QuickPhraseFavorite[]> {
  return db.quickPhraseFavorites
    .where("userId")
    .equals(userId)
    .toArray();
}

export async function addQuickPhraseFavorite(
  userId: string,
  quickPhraseId: string,
): Promise<QuickPhraseFavorite> {
  return db.transaction("rw", db.quickPhraseFavorites, async () => {
    const existingFavorite = await db.quickPhraseFavorites
      .where("[userId+quickPhraseId]")
      .equals([userId, quickPhraseId])
      .first();

    if (existingFavorite) {
      return existingFavorite;
    }

    const favorite: QuickPhraseFavorite = {
      id: crypto.randomUUID(),
      userId,
      quickPhraseId,
    };

    await db.quickPhraseFavorites.add(favorite);

    return favorite;
  });
}

export async function removeQuickPhraseFavorite(
  favoriteId: string,
): Promise<void> {
  await db.quickPhraseFavorites.delete(favoriteId);
}
