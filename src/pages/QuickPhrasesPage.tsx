import { useEffect, useState } from "react";
import {
  getQuickPhrases,
  createQuickPhrase,
} from "../services/quickPhraseService";
import type { QuickPhrase } from "../types/quickPhrase";
import { speak } from "../utils/speech";
import {
  getQuickPhraseFavorites,
  addQuickPhraseFavorite,
  removeQuickPhraseFavorite,
} from "../services/quickPhraseFavoriteService";
import type { QuickPhraseFavorite } from "../types/quickPhraseFavorite";
import QuickPhraseCard from "../components/common/QuickPhraseCard";
import { Pencil } from "lucide-react";
import QuickPhraseForm from "../components/quickPhrases/QuickPhraseForm";

function QuickPhrasesPage() {
  const [phrases, setPhrases] = useState<QuickPhrase[]>([]);
  const [error, setError] = useState("");
  const [speakingPhraseId, setSpeakingPhraseId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<QuickPhraseFavorite[]>([]);
  const [updatingFavoriteId, setUpdatingFavoriteId] = useState<string | null>(
    null,
  );
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(false);
  const [isAddPhraseOpen, setIsAddPhraseOpen] = useState(false);

  useEffect(() => {
    async function loadPhrases() {
      try {
        const [phrasesData, favoritesData] = await Promise.all([
          getQuickPhrases(),
          getQuickPhraseFavorites("local-user"),
        ]);

        setPhrases(phrasesData);
        setFavorites(favoritesData);
      } catch {
        setError("Não foi possível carregar as frases rápidas.");
      }
    }

    loadPhrases();
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

        setFavorites((currentFavorites) => [...currentFavorites, newFavorite]);
      }

      setError("");
    } catch {
      setError("Não foi possível atualizar os favoritos.");
    } finally {
      setUpdatingFavoriteId(null);
    }
  }

  async function handleSavePhrase(phrase: Omit<QuickPhrase, "id">) {
    const nextPosition =
      Math.max(0, ...phrases.map((item) => item.position)) + 1;

    const newPhrase = await createQuickPhrase({
      ...phrase,
      position: nextPosition,
    });

    setPhrases((currentPhrases) => [...currentPhrases, newPhrase]);
  }

  return (
    <main className="min-h-screen bg-[#E5E5E5] p-4 pb-28">
      <header className="mb-5 pt-3">
        <h1 className="mb-6 text-center text-2xl font-bold tracking-tight text-[#383838]">
          Frases Rápidas
        </h1>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-white px-4 py-3 shadow-sm">
          <p className="text-sm font-medium text-[#383838]">
            Toque em uma frase para falar
          </p>

          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFA726] text-lg"
          >
            🔊
          </span>
        </div>
      </header>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

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

      {isManageMenuOpen && (
        <div className="fixed bottom-40 right-4 z-10 flex flex-col gap-2 rounded-xl bg-white p-3 shadow-lg">
          <button
            type="button"
            className="rounded-lg bg-[#F5F5F5] px-4 py-2 text-sm font-medium text-[#383838]"
          >
            Editar frase
          </button>

          <button
            type="button"
            onClick={() => {
              setIsManageMenuOpen(false);
              setIsAddPhraseOpen(true);
            }}
            className="rounded-lg bg-[#F5F5F5] px-4 py-2 text-sm font-medium text-[#383838]"
          >
            Adicionar frase
          </button>
        </div>
      )}

      {isAddPhraseOpen && (
        <QuickPhraseForm
          onClose={() => setIsAddPhraseOpen(false)}
          onSave={handleSavePhrase}
        />
      )}

      <button
        type="button"
        onClick={() => setIsManageMenuOpen((current) => !current)}
        aria-expanded={isManageMenuOpen}
        aria-label="Gerenciar frases rápidas"
        className="fixed bottom-24 right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#383838] shadow-lg"
      >
        <Pencil size={26} strokeWidth={2.5} />
      </button>
    </main>
  );
}

export default QuickPhrasesPage;
