import type { Card } from '../../types/card';

interface CardItemProps {
  card: Card;
}

function CardItem({ card }: CardItemProps) {
  return (
    <article className="rounded-lg border p-4">
      <h2 className="font-semibold">{card.title}</h2>
      <p className="text-sm text-gray-600">{card.speechText}</p>
    </article>
  );
}

export default CardItem;