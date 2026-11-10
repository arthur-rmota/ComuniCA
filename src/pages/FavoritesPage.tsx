import { useEffect, useState } from "react";
import { getQuickPhrases } from "../services/quickPhraseService";
import {
  getQuickPhraseFavorites,
  removeQuickPhraseFavorite,
} from "../services/quickPhraseFavoriteService";
import type { QuickPhrase } from "../types/quickPhrase";
import QuickPhraseCard from "../components/common/QuickPhraseCard";
import { speak } from "../utils/speech";

function FavoritesPage() {
  const [favoritePhrases, setFavoritePhrases] = useState<QuickPhrase[]>([]);
  const [error, setError] = useState("");
  const [speakingPhraseId, setSpeakingPhraseId] = useState<string | null>(null);
  const [updatingFavoriteId, setUpdatingFavoriteId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function loadFavorites() {
      try {
        const [phrases, favorites] = await Promise.all([
          getQuickPhrases(),
          getQuickPhraseFavorites("local-user"),
        ]);

        const filteredPhrases = phrases.filter((phrase) =>
          favorites.some((favorite) => favorite.quickPhraseId === phrase.id),
        );

        setFavoritePhrases(filteredPhrases);
      } catch {
        setError("Não foi possível carregar as frases favoritas.");
      }
    }

    loadFavorites();
  }, []);

  function handleSpeak(phrase: QuickPhrase) {
    setSpeakingPhraseId(null);

    speak(
      phrase.text,
      () => setSpeakingPhraseId(phrase.id),
      () =>
        setSpeakingPhraseId((currentId) =>
          currentId === phrase.id ? null : currentId,
        ),
    );
  }

  async function handleRemoveFavorite(phrase: QuickPhrase) {
    if (updatingFavoriteId !== null) return;

    setUpdatingFavoriteId(phrase.id);

    try {
      const favorites = await getQuickPhraseFavorites("local-user");

      const existingFavorite = favorites.find(
        (favorite) => favorite.quickPhraseId === phrase.id,
      );

      if (!existingFavorite) return;

      await removeQuickPhraseFavorite(existingFavorite.id);

      setFavoritePhrases((currentPhrases) =>
        currentPhrases.filter(
          (currentPhrase) => currentPhrase.id !== phrase.id,
        ),
      );

      setError("");
    } catch {
      setError("Não foi possível remover a frase dos favoritos.");
    } finally {
      setUpdatingFavoriteId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#E5E5E5] p-4 pb-28">
      <header className="mb-6 pt-3">
        <h1 className="text-center text-2xl font-bold text-[#383838]">
          Favoritos
        </h1>
      </header>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!error && (
        <>
          <p className="mb-4 text-center text-sm text-[#383838]">
            {favoritePhrases.length}{" "}
            {favoritePhrases.length === 1
              ? "frase favorita"
              : "frases favoritas"}
          </p>

          {favoritePhrases.length === 0 ? (
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
              <p className="font-medium text-[#383838]">
                Você ainda não possui frases favoritas.
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Acesse Frases Rápidas e toque na estrela para adicionar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {favoritePhrases.map((phrase) => (
                <QuickPhraseCard
                  key={phrase.id}
                  phrase={phrase}
                  isFavorite={true}
                  isSpeaking={speakingPhraseId === phrase.id}
                  isUpdatingFavorite={updatingFavoriteId !== null}
                  onSpeak={handleSpeak}
                  onToggleFavorite={handleRemoveFavorite}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default FavoritesPage;
