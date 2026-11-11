
import { db } from "../database/db";
import type { Category } from "../types/category";

export const categoryService = {
  async create(category: Category): Promise<string> {
    return db.categories.add(category);
  },

  async getById(id: string): Promise<Category | undefined> {
    return db.categories.get(id);
  },

  async getAll(): Promise<Category[]> {
    return db.categories.orderBy("position").toArray();
  },

  async update(
    id: string,
    changes: Partial<Category>,
  ): Promise<number> {
    return db.categories.update(id, changes);
  },

  async remove(id: string): Promise<void> {
    await db.categories.delete(id);
  },
};

// Compatibilidade temporária com componentes existentes.
export async function getCategories(): Promise<Category[]> {
  return categoryService.getAll();
}
