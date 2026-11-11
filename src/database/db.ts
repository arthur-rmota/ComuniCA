import Dexie, { type Table } from "dexie";
import type { User } from "../types/user";

export class ComuniCADatabase extends Dexie {
  users!: Table<User, string>;

  constructor() {
    super("ComuniCADatabase");

    this.version(1).stores({
      users: "id, email",
    });
  }
}

export const db = new ComuniCADatabase();