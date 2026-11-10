import API_URL from "./api";
import type { QuickPhrase } from "../types/quickPhrase";

export async function getQuickPhrases(): Promise<QuickPhrase[]> {
  const response = await fetch(`${API_URL}/quickPhrases`);

  if (!response.ok) {
    throw new Error("Erro ao buscar frases rápidas");
  }

  const phrases: QuickPhrase[] = await response.json();

  return phrases.sort((a, b) => a.position - b.position);
}

export async function createQuickPhrase(
  phrase: Omit<QuickPhrase, "id">,
): Promise<QuickPhrase> {
  const response = await fetch(`${API_URL}/quickPhrases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(phrase),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar frase rápida");
  }

  const newPhrase: QuickPhrase = await response.json();

  return newPhrase;
}
export async function updateQuickPhrase(
  id: string,
  changes: Partial<Omit<QuickPhrase, "id">>,
): Promise<QuickPhrase> {
  const response = await fetch(
    `${API_URL}/quickPhrases/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao atualizar frase rápida");
  }

  const updatedPhrase: QuickPhrase = await response.json();

  return updatedPhrase;
}