import Dexie, { type Table } from "dexie";
import type { User } from "../types/user";
import type { Category } from "../types/category";
import type { Card } from "../types/card";
import type { QuickPhrase } from "../types/quickPhrase";
import type { QuickPhraseFavorite } from "../types/quickPhraseFavorite";

export class ComuniCADatabase extends Dexie {
  users!: Table<User, string>;
  categories!: Table<Category, string>;
  cards!: Table<Card, string>;
  quickPhrases!: Table<QuickPhrase, string>;
  quickPhraseFavorites!: Table<QuickPhraseFavorite, string>;
  seedMetadata!: Table<{ key: string }, string>;

  constructor() {
    super("ComuniCADatabase");

    this.version(1).stores({
      users: "id, email",
    });

    this.version(2).stores({
      users: "id, email",
      categories: "id, name, ownerId, position",
    });

    this.version(3).stores({
      users: "id, email",
      categories: "id, name, ownerId, position",
      cards: "id, categoryId, ownerId, isActive",
    });

    this.version(4).stores({
      users: "id, email",
      categories: "id, name, ownerId, position",
      cards: "id, categoryId, ownerId, isActive",
      quickPhrases: "id, userId, categoryId, position",
    });
    this.version(5).stores({
      users: "id, email",
      categories: "id, name, ownerId, position",
      cards: "id, categoryId, ownerId, isActive",
      quickPhrases: "id, userId, categoryId, position",
      quickPhraseFavorites: "id, userId, quickPhraseId, [userId+quickPhraseId]",
    });
    this.version(6).stores({
      users: "id, email",
      categories: "id, name, ownerId, position",
      cards: "id, categoryId, ownerId, isActive",
      quickPhrases: "id, userId, categoryId, position",
      quickPhraseFavorites: "id, userId, quickPhraseId, [userId+quickPhraseId]",
      seedMetadata: "key",
    });
  }
}

export const db = new ComuniCADatabase();
