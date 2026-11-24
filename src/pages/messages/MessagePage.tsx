import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  LayoutGrid,
  MessageCircle,
  RotateCcw,
  Square,
  Volume2,
} from "lucide-react";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  SortableContext,
} from "@dnd-kit/sortable";

import { useNavigate } from "react-router";

import AppIcon from "../../components/common/AppIcon";
import SortableMessageWord from "../../components/messages/SortableMessageWord";

import {
  availableMessageGroups,
  availableMessageWords,
  formatMessage,
  messageGroups,
  suggestedMessageGroup,
  type MessageGroupId,
  type MessageWord,
} from "../../data/messageVocabulary";

import { useMessageBuilder } from "../../hooks/useMessageBuilder";
import { getCards } from "../../services/cardService";
import type { Card } from "../../types/card";

import {
  canRepeatSpeech,
  repeatLastSpeech,
  speak,
  stopSpeaking,
} from "../../utils/speech";

const wordPictograms: Record<string, string> = {
  // Pessoas
  eu: "Eu",
  voce: "Voce",
  mamae: "Mamae",
  papai: "Papai",

  // Ações
  quero: "Quero",
  preciso: "Preciso",
  estou: "Estou",
  gosto: "Gosto",
  posso: "Posso",
  "nao-quero": "NaoQuero",
  vou: "Vou",
  "nao-posso": "NaoPosso",
  adoro: "Adoro",
  "nao-gosto": "NaoGosto",

  // Objetos, alimentos e necessidades
  agua: "Agua",
  comida: "Comida",
  ajuda: "Ajuda",
  casa: "Casa",
  suco: "CupSoda",
  leite: "Milk",
  lanche: "Cookie",
  fruta: "Apple",
  brinquedo: "Brinquedo",
  bola: "Bola",
  livro: "BookOpen",
  abraco: "Abraco",
  musica: "Music",

  // Atividades
  jogar: "Jogar",
  brincar: "Brincar",
  dormir: "Dormir",
  ler: "Ler",
  comer: "Comer",
  beber: "Beber",
  desenhar: "Desenhar",
  cantar: "Cantar",
  passear: "Footprints",
  banheiro: "Banheiro",
  banho: "Banho",
  descansar: "Descansar",
  "ir-casa": "IrCasa",

  // Sentimentos e sensações
  feliz: "Smile",
  triste: "Frown",
  bem: "Bem",
  mal: "Mal",
  medo: "Medo",
  sono: "Sono",
  fome: "Fome",
  sede: "Sede",
  frio: "Frio",
  calor: "Calor",
  dor: "Dor",

  // Tempo
  agora: "Agora",
  depois: "Depois",
  hoje: "Hoje",
  amanha: "Amanha",

  // Expressões sociais
  "por-favor": "PorFavor",
  sim: "Sim",
  nao: "Nao",
  ola: "Ola",
  tchau: "Tchau",
  obrigado: "Obrigado",
  obrigada: "Obrigado",
};

function getWordIcon(word: MessageWord): string {
  if (word.role === "personal") {
    return word.originalCard?.icon || "MessageCircle";
  }

  return wordPictograms[word.id] ?? "MessageCircle";
}

export default function MessagePage() {
  const navigate = useNavigate();

  const {
    items,
    finalizedText,
    addItem,
    removeItem,
    finalizeMessage,
    moveItem,
  } = useMessageBuilder();

  const [groupId, setGroupId] = useState<MessageGroupId>("quem");
  const [showGroups, setShowGroups] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [cardsError, setCardsError] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [canRepeat, setCanRepeat] = useState(() => canRepeatSpeech());
  const [notice, setNotice] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);

    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const direction = oldIndex < newIndex ? "right" : "left";
    const steps = Math.abs(newIndex - oldIndex);

    for (let step = 0; step < steps; step++) {
      moveItem(String(active.id), direction);
    }

    setShowGroups(false);
    setNotice("");
  }

  useEffect(() => {
    let active = true;

    getCards()
      .then((result) => {
        if (active) setCards(result);
      })
      .catch((error: unknown) => {
        console.error("Erro ao carregar cartões:", error);

        if (active) {
          setCardsError("Seus cartões não puderam ser carregados.");
        }
      })
      .finally(() => {
        if (active) setLoadingCards(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const currentGroup = messageGroups.find((group) => group.id === groupId)!;

  const allowedGroups = availableMessageGroups(items);

  const visibleWords: MessageWord[] =
    groupId === "cartoes" && allowedGroups.includes("cartoes")
      ? cards
          .filter((card) => card.isActive)
          .map((card) => ({
            id: card.id,
            label: card.title,
            speechText: card.speechText,
            role: "personal",
            originalCard: card,
            Icon: MessageCircle,
          }))
      : availableMessageWords(groupId, items);

  const draft = items
    .map((item) => item.speechText.trim())
    .filter(Boolean)
    .join(" ");

  function addWord(word: MessageWord): void {
    if (!word.speechText.trim()) return;

    if (
      !allowedGroups.includes(groupId) ||
      !visibleWords.some((option) => option.id === word.id)
    ) {
      return;
    }

    const card: Card = {
      id:
        word.role === "personal"
          ? `personal-${word.id}`
          : `vocabulary-${word.id}`,
      title: word.label,
      speechText: word.speechText,
      icon: getWordIcon(word),
      image: word.originalCard?.image ?? null,
      altText: word.originalCard?.altText ?? word.label,
      categoryId: `vocabulary-${groupId}`,
      ownerId: null,
      keywords: [word.speechText],
      isActive: true,
    };

    addItem(card);
    setNotice("");
    setShowGroups(false);

    const nextItems = [
      ...items,
      {
        id: `preview-${items.length}`,
        cardId: card.id,
        title: card.title,
        speechText: card.speechText,
        icon: card.icon ?? null,
        image: card.image,
      },
    ];

    setGroupId(suggestedMessageGroup(nextItems) ?? groupId);
  }

  function handleRemove(itemId: string): void {
    const remaining = items.filter((item) => item.id !== itemId);

    removeItem(itemId);
    setGroupId(suggestedMessageGroup(remaining) ?? "quem");
    setShowGroups(false);
  }

  function handleSpeak(): void {
    const text = finalizedText ?? finalizeMessage();

    if (!text) return;

    if (!("speechSynthesis" in window)) {
      setNotice("Este dispositivo não oferece reprodução por voz.");
      return;
    }

    setNotice("");

    speak(
      formatMessage(text),
      () => setSpeaking(true),
      () => setSpeaking(false),
    );

    setCanRepeat(canRepeatSpeech());
  }

  function handleRepeat(): void {
    if (!canRepeatSpeech()) return;

    repeatLastSpeech(
      () => setSpeaking(true),
      () => setSpeaking(false),
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FFF9F3] px-4 pb-28 pt-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#FFE6D0]/60"
      />

      <div className="relative mx-auto w-full max-w-lg">
        <header className="mb-5 pt-3">
          <div className="relative flex min-h-14 items-center justify-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Voltar para o início"
              className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#42251D] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <ArrowLeft size={24} strokeWidth={2.5} aria-hidden="true" />
            </button>

            <h1 className="px-14 text-center text-2xl font-extrabold tracking-tight text-[#42251D]">
              Minha frase
            </h1>
          </div>
        </header>

        <section
          aria-label="Mensagem em construção"
          className="mb-6 rounded-3xl border border-[#F5E9DF] bg-white p-4 shadow-[0_5px_14px_rgba(41,37,36,0.06)]"
        >
          {items.length === 0 ? (
            <div className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-dashed border-[#EEDFD2] bg-[#FFFCF9] p-3 text-center">
              <p className="text-sm font-semibold text-[#80685D]">
                Toque em uma palavra
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={items.map((item) => item.id)}
                strategy={rectSortingStrategy}
              >
                <div
                  className="flex min-w-0 flex-1 flex-wrap gap-2"
                  aria-label="Palavras da mensagem"
                >
                  {items.map((item) => (
                    <SortableMessageWord
                      key={item.id}
                      item={item}
                      onRemove={() => handleRemove(item.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}

          <p className="sr-only" aria-live="polite">
            {draft ? `Mensagem: ${formatMessage(draft)}` : "Mensagem vazia"}
          </p>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleSpeak}
              disabled={items.length === 0}
              className="flex min-h-14 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 text-base font-extrabold text-white shadow-sm transition-transform active:scale-[0.98] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <Volume2 size={23} aria-hidden="true" />
              Falar
            </button>

            {speaking ? (
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setSpeaking(false);
                }}
                aria-label="Parar a fala"
                className="flex min-h-14 min-w-14 items-center justify-center rounded-2xl border border-[#F2D8C5] bg-[#FFF0E4] text-brand-primary focus-visible:outline-2 focus-visible:outline-brand-primary"
              >
                <Square size={22} aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRepeat}
                disabled={!canRepeat}
                aria-label="Repetir a última fala"
                className="flex min-h-14 min-w-14 items-center justify-center rounded-2xl border border-[#F2D8C5] bg-[#FFF0E4] text-brand-primary disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-brand-primary"
              >
                <RotateCcw size={22} aria-hidden="true" />
              </button>
            )}
          </div>
        </section>

        {notice && (
          <p
            role="status"
            className="mb-4 rounded-2xl bg-[#FFF0E4] p-3 text-sm font-semibold text-[#9A3412]"
          >
            {notice}
          </p>
        )}

        <section aria-labelledby="word-bank-title">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2
              id="word-bank-title"
              className="text-xl font-extrabold text-[#42251D]"
            >
              {allowedGroups.length === 0 ? "Pronto!" : currentGroup.label}
            </h2>

            <button
              type="button"
              onClick={() => setShowGroups((current) => !current)}
              disabled={allowedGroups.length <= 1}
              aria-expanded={showGroups}
              aria-controls="message-word-groups"
              className="flex min-h-11 items-center gap-1.5 rounded-xl px-2 text-sm font-bold text-[#80685D] hover:bg-[#FFF0E4] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-brand-primary"
            >
              <LayoutGrid size={18} aria-hidden="true" />

              <span>Outras palavras</span>

              <ChevronDown
                size={16}
                aria-hidden="true"
                className={`transition-transform ${
                  showGroups ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <div
            id="message-word-groups"
            className={`${
              showGroups ? "mb-5 grid" : "hidden"
            } grid-cols-2 gap-2 rounded-2xl border border-[#F5E9DF] bg-white p-3`}
            role="group"
            aria-label="Escolher grupo de palavras"
          >
            {messageGroups
              .filter((group) => allowedGroups.includes(group.id))
              .map((group) => {
                const selected = group.id === groupId;

                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => {
                      setGroupId(group.id);
                      setShowGroups(false);
                    }}
                    aria-pressed={selected}
                    className={`flex min-h-14 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-bold focus-visible:outline-2 focus-visible:outline-brand-primary ${
                      selected
                        ? "border-brand-primary bg-[#FFF0E4] text-[#9A3412]"
                        : "border-[#F5E9DF] bg-[#FFFCF9] text-[#592B1D]"
                    }`}
                  >
                    <AppIcon
                      name={group.Icon.displayName ?? "MessageCircle"}
                      size={40}
                    />

                    <span>{group.label}</span>
                  </button>
                );
              })}
          </div>

          {allowedGroups.length === 0 ? (
            <p className="rounded-2xl bg-white p-4 text-center text-sm font-semibold text-[#80685D]">
              Frase pronta para falar!
            </p>
          ) : groupId === "cartoes" && loadingCards ? (
            <p
              role="status"
              className="rounded-2xl bg-white p-4 text-sm text-[#80685D]"
            >
              Carregando cartões...
            </p>
          ) : groupId === "cartoes" && cardsError ? (
            <p
              role="alert"
              className="rounded-2xl bg-white p-4 text-sm text-red-700"
            >
              {cardsError}
            </p>
          ) : visibleWords.length === 0 ? (
            <p className="rounded-2xl bg-white p-4 text-sm text-[#80685D]">
              Nenhuma palavra disponível.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {visibleWords.map((word) => (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => addWord(word)}
                  aria-label={`Adicionar ${word.label} à mensagem`}
                  className="group relative flex min-h-44 min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-3xl border-2 border-white/60 p-2 text-center shadow-[0_5px_14px_rgba(41,37,36,0.07)] transition-transform duration-150 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  style={{
                    backgroundColor: currentGroup.color,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/15"
                  />

                  {word.originalCard?.image ? (
                    <img
                      src={word.originalCard.image}
                      alt=""
                      width={128}
                      height={128}
                      draggable={false}
                      className="relative h-32 w-32 select-none object-contain"
                    />
                  ) : (
                    <AppIcon
                      name={getWordIcon(word)}
                      size={128}
                      className="relative"
                    />
                  )}

                  <span className="relative break-words text-base font-extrabold leading-tight text-[#42251D]">
                    {word.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
