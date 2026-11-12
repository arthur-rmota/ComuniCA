
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Pencil } from "lucide-react";

import { getQuickPhrases } from "../services/quickPhraseService";
import {
  getQuickPhraseFavorites,
  addQuickPhraseFavorite,
  removeQuickPhraseFavorite,
} from "../services/quickPhraseFavoriteService";

import type { QuickPhrase } from "../types/quickPhrase";
import type { QuickPhraseFavorite } from "../types/quickPhraseFavorite";

import { speak } from "../utils/speech";
import QuickPhraseCard from "../components/common/QuickPhraseCard";

function QuickPhrasesPage() {
  const navigate = useNavigate();

  const [phrases, setPhrases] = useState<QuickPhrase[]>([]);
  const [error, setError] = useState("");
  const [speakingPhraseId, setSpeakingPhraseId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<QuickPhraseFavorite[]>([]);
  const [updatingFavoriteId, setUpdatingFavoriteId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    let active = true;

    async function loadPhrases() {
      try {
        const phrasesData = await getQuickPhrases();

        if (active) {
          setPhrases(phrasesData);
        }
      } catch (error) {
        console.error("Erro ao carregar frases rápidas:", error);

        if (active) {
          setError("Não foi possível carregar as frases rápidas.");
        }
      }

      try {
        const favoritesData = await getQuickPhraseFavorites("local-user");

        if (active) {
          setFavorites(favoritesData);
        }
      } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
      }
    }

    void loadPhrases();

    return () => {
      active = false;
    };
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

  async function handleToggleFavorite(phrase: QuickPhrase) {
    if (updatingFavoriteId !== null) return;

    const existingFavorite = favorites.find(
      (favorite) => favorite.quickPhraseId === phrase.id,
    );

    setUpdatingFavoriteId(phrase.id);

    try {
      if (existingFavorite) {
        await removeQuickPhraseFavorite(existingFavorite.id);

        setFavorites((currentFavorites) =>
          currentFavorites.filter(
            (favorite) => favorite.id !== existingFavorite.id,
          ),
        );
      } else {
        const newFavorite = await addQuickPhraseFavorite(
          "local-user",
          phrase.id,
        );

        setFavorites((currentFavorites) => [
          ...currentFavorites,
          newFavorite,
        ]);
      }

      setError("");
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
      setError("Não foi possível atualizar os favoritos.");
    } finally {
      setUpdatingFavoriteId(null);
    }
  }

  return (
    <main className="min-h-screen bg-app-background p-4 pb-28">
      <header className="mb-5 pt-3">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-app-text">
          Frases Rápidas
        </h1>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-app-text">
            Toque em uma frase para falar
          </p>

          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-lg"
          >
            🔊
          </span>
        </div>
      </header>

      {error && (
        <p role="alert" className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        {phrases.map((phrase) => (
          <QuickPhraseCard
            key={phrase.id}
            phrase={phrase}
            isFavorite={favorites.some(
              (favorite) => favorite.quickPhraseId === phrase.id,
            )}
            isSpeaking={speakingPhraseId === phrase.id}
            isUpdatingFavorite={updatingFavoriteId !== null}
            onSpeak={handleSpeak}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate("/rapidos/gerenciar")}
        aria-label="Gerenciar frases rápidas"
        className="fixed bottom-24 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-app-text shadow-lg"
      >
        <Pencil size={26} strokeWidth={2.5} />
      </button>
    </main>
  );
}

export default QuickPhrasesPage;
