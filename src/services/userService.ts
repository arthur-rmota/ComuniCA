import { db } from "../database/db";
import type { User } from "../types/user";

export const userService = {
  async create(user: User): Promise<string> {
    return db.users.add(user);
  },

  async getById(id: string): Promise<User | undefined> {
    return db.users.get(id);
  },

  async getByEmail(email: string): Promise<User | undefined> {
    return db.users.where("email").equals(email).first();
  },

  async getAll(): Promise<User[]> {
    return db.users.toArray();
  },

  async update(id: string, changes: Partial<User>): Promise<number> {
    return db.users.update(id, changes);
  },

  async remove(id: string): Promise<void> {
    await db.users.delete(id);
  },
};
