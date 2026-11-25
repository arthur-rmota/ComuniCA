import { useInterface } from "../../contexts/InterfaceContext";
import { interfaceSizes } from "../../constants/interfaceSizes";
import AppIcon from "../common/AppIcon";

function InterfacePreview() {
  const { settings } = useInterface();

  const cardHeight = interfaceSizes[settings.cardSize].cardHeight;

  const textSize = interfaceSizes[settings.textSize].textSize;

  const symbolSize = interfaceSizes[settings.symbolSize].symbolSize;
  const minCardWidth = Math.max(
    136,
    cardHeight - 24,
    symbolSize + 28,
    textSize * 6 + 20,
  );

  const previewCards = [
    {
      id: 1,
      title: "Eu gosto",
      icon: "Heart",
      color: "#B8D8BA",
    },
    {
      id: 2,
      title: "Quero comer",
      icon: "Utensils",
      color: "#A9D4BE",
    },
    {
      id: 3,
      title: "Estou feliz",
      icon: "Smile",
      color: "#F5B5B5",
    },
  ];

  return (
    <section className="rounded-2xl border border-[#F1E4D9] bg-white p-4">
      <div className="mb-4">
        <h2 className="font-extrabold text-[#42251D]">Pré-visualização</h2>

        <p className="mt-1 text-sm leading-relaxed text-[#80685D]">
          Veja como os cartões ficarão com os tamanhos selecionados.
        </p>
      </div>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${minCardWidth}px), 1fr))`,
        }}
      >
        {previewCards.map((card) => (
          <div
            key={card.id}
            className="relative flex min-w-0 flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl border-2 border-white/60 p-3 text-center shadow-[0_5px_14px_rgba(41,37,36,0.07)]"
            style={{
              backgroundColor: card.color,
              minHeight: `${cardHeight}px`,
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/15"
            />

            <AppIcon
              name={card.icon}
              size={symbolSize}
              className="relative max-w-full"
            />

            <span
              className="relative w-full font-extrabold leading-tight text-[#42251D] [overflow-wrap:anywhere]"
              style={{
                fontSize: `${textSize}px`,
              }}
            >
              {card.title}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-3 text-center text-xs text-[#80685D]">
        Exemplo ilustrativo dos cartões de comunicação.
      </p>
    </section>
  );
}

export default InterfacePreview;
