import API_URL from './api';
import type { QuickPhrase } from '../types/quickPhrase';

export async function getQuickPhrases(): Promise<QuickPhrase[]> {
  const response = await fetch(`${API_URL}/quickPhrases`);

  if (!response.ok) {
    throw new Error('Erro ao buscar frases rápidas');
  }

  const phrases: QuickPhrase[] = await response.json();

  return phrases.sort((a, b) => a.position - b.position);
}