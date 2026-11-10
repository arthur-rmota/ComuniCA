import API_URL from './api';
import type { Card } from '../types/card';

export async function getCards(): Promise<Card[]> {
  const response = await fetch(`${API_URL}/cards`);

  if (!response.ok) {
    throw new Error('Erro ao buscar cartões');
  }

  const cards: Card[] = await response.json();

  return cards.filter((card) => card.isActive);
}