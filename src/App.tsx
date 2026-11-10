import { useEffect, useState } from "react";
import { getCards } from "./services/cardService";
import type { Card } from "./types/card";
import CardItem from "./components/common/CardItem";

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCards() {
      try {
        const data = await getCards();
        setCards(data);
      } catch {
        setError("Não foi possível carregar os cartões.");
      }
    }

    loadCards();
  }, []);

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Cartões do ComuniCA</h1>

      {error && <p>{error}</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
    </main>
  );
}

export default App;
