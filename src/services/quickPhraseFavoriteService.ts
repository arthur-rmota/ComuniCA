import API_URL from "./api";
import type { QuickPhraseFavorite } from "../types/quickPhraseFavorite";

export async function getQuickPhraseFavorites(
  userId: string,
): Promise<QuickPhraseFavorite[]> {
  const response = await fetch(
    `${API_URL}/quickPhraseFavorites?userId=${encodeURIComponent(userId)}`,
  );

  if (!response.ok) {
    throw new Error("Erro ao buscar frases favoritas");
  }

  const favorites: QuickPhraseFavorite[] = await response.json();

  return favorites;
}

export async function addQuickPhraseFavorite(
  userId: string,
  quickPhraseId: string,
): Promise<QuickPhraseFavorite> {
  const response = await fetch(`${API_URL}/quickPhraseFavorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      quickPhraseId,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao adicionar frase aos favoritos");
  }

  const favorite: QuickPhraseFavorite = await response.json();

  return favorite;
}

export async function removeQuickPhraseFavorite(
  favoriteId: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/quickPhraseFavorites/${favoriteId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Erro ao remover frase dos favoritos");
  }
}