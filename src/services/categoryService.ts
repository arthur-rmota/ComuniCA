import API_URL from './api';
import type { Category } from '../types/category';

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error('Erro ao buscar categorias');
  }

  const categories: Category[] = await response.json();

  return categories.sort((a, b) => a.position - b.position);
}