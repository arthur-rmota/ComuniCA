
import Dexie, { type Table } from "dexie";
import type { User } from "../types/user";
import type { Category } from "../types/category";
import type { Card } from "../types/card";

export class ComuniCADatabase extends Dexie {
  users!: Table<User, string>;
  categories!: Table<Category, string>;
  cards!: Table<Card, string>;

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
  }
}

export const db = new ComuniCADatabase();
