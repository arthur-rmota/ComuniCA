import {
  Apple,
  Bath,
  Bed,
  BookOpen,
  CalendarDays,
  Check,
  CircleDot,
  Clock3,
  Coffee,
  Cookie,
  Footprints,
  Frown,
  Gamepad2,
  GlassWater,
  Hand,
  HandHeart,
  Heart,
  HeartHandshake,
  HeartPulse,
  House,
  LifeBuoy,
  MessageCircle,
  MicVocal,
  Milk,
  Moon,
  Music2,
  Pencil,
  Plus,
  ShieldAlert,
  Smile,
  Snowflake,
  Sun,
  Toilet,
  ToyBrick,
  UserRound,
  Users,
  Utensils,
  X,
  type LucideIcon,
} from "lucide-react";

import type { MessageItem } from "../types/message";
import type { Card } from "../types/card";

export type MessageGroupId =
  | "quem"
  | "acoes"
  | "coisas"
  | "sentimentos"
  | "mais"
  | "cartoes";

export type WordRole =
  | "subject"
  | "action"
  | "noun"
  | "activity"
  | "feeling"
  | "extra"
  | "personal";

export interface MessageWord {
  id: string;
  label: string;
  speechText: string;
  Icon: LucideIcon;
  role: WordRole;
  originalCard?: Card;
}

export interface MessageGroup {
  id: MessageGroupId;
  label: string;
  Icon: LucideIcon;
  color: string;
  words: MessageWord[];
}

// Facilita a criação de novas palavras.
function word(
  id: string,
  label: string,
  speechText: string,
  Icon: LucideIcon,
  role: WordRole,
): MessageWord {
  return {
    id,
    label,
    speechText,
    Icon,
    role,
  };
}

// Vocabulário básico do construtor de frases.
// Os cartões cadastrados pelo usuário permanecem separados.
export const messageGroups: MessageGroup[] = [
  {
    id: "quem",
    label: "Quem?",
    Icon: UserRound,
    color: "#FFE8D4",
    words: [
      word("eu", "Eu", "eu", UserRound, "subject"),
      word("voce", "Você", "você", UserRound, "subject"),
      word("mamae", "Mamãe", "mamãe", Heart, "subject"),
      word("papai", "Papai", "papai", Users, "subject"),
    ],
  },

  {
    id: "acoes",
    label: "Ações",
    Icon: HandHeart,
    color: "#DFEAFF",
    words: [
      word("quero", "Quero", "quero", HandHeart, "action"),
      word("preciso", "Preciso de", "preciso de", LifeBuoy, "action"),
      word("estou", "Estou", "estou", UserRound, "action"),
      word("gosto", "Gosto de", "gosto de", Heart, "action"),
      word("posso", "Posso", "posso", Hand, "action"),
      word("nao-quero", "Não quero", "não quero", X, "action"),
      word("vou", "Vou", "vou", Footprints, "action"),
      word("nao-posso", "Não posso", "não posso", ShieldAlert, "action"),
      word("adoro", "Adoro", "adoro", Heart, "action"),
      word("nao-gosto", "Não gosto de", "não gosto de", Frown, "action"),
    ],
  },

  {
    id: "coisas",
    label: "O quê?",
    Icon: GlassWater,
    color: "#DDEFE3",
    words: [
      // Objetos, alimentos e necessidades.
      word("agua", "Água", "água", GlassWater, "noun"),
      word("comida", "Comida", "comida", Utensils, "noun"),
      word("ajuda", "Ajuda", "ajuda", LifeBuoy, "noun"),
      word("casa", "Casa", "casa", House, "noun"),
      word("suco", "Suco", "suco", Coffee, "noun"),
      word("leite", "Leite", "leite", Milk, "noun"),
      word("lanche", "Lanche", "lanche", Cookie, "noun"),
      word("fruta", "Fruta", "fruta", Apple, "noun"),
      word("brinquedo", "Brinquedo", "brinquedo", ToyBrick, "noun"),
      word("bola", "Bola", "bola", CircleDot, "noun"),
      word("livro", "Livro", "livro", BookOpen, "noun"),
      word("abraco", "Abraço", "abraço", HeartHandshake, "noun"),
      word("musica", "Música", "música", Music2, "noun"),

      // Atividades representadas por verbos no infinitivo.
      word("jogar", "Jogar", "jogar", Gamepad2, "activity"),
      word("brincar", "Brincar", "brincar", ToyBrick, "activity"),
      word("dormir", "Dormir", "dormir", Bed, "activity"),
      word("ler", "Ler", "ler", BookOpen, "activity"),
      word("comer", "Comer", "comer", Utensils, "activity"),
      word("beber", "Beber", "beber", GlassWater, "activity"),
      word("desenhar", "Desenhar", "desenhar", Pencil, "activity"),
      word("cantar", "Cantar", "cantar", MicVocal, "activity"),
      word("passear", "Passear", "passear", Footprints, "activity"),
      word("banheiro", "Ir ao banheiro", "ir ao banheiro", Toilet, "activity"),
      word("banho", "Tomar banho", "tomar banho", Bath, "activity"),
      word("descansar", "Descansar", "descansar", Bed, "activity"),
      word("ir-casa", "Ir para casa", "ir para casa", House, "activity"),
    ],
  },

  {
    id: "sentimentos",
    label: "Sentimentos",
    Icon: Heart,
    color: "#FCE0E3",
    words: [
      word("feliz", "Feliz", "feliz", Smile, "feeling"),
      word("triste", "Triste", "triste", Frown, "feeling"),
      word("bem", "Bem", "bem", Smile, "feeling"),
      word("mal", "Mal", "mal", Frown, "feeling"),
      word("medo", "Com medo", "com medo", ShieldAlert, "feeling"),
      word("sono", "Com sono", "com sono", Moon, "feeling"),
      word("fome", "Com fome", "com fome", Utensils, "feeling"),
      word("sede", "Com sede", "com sede", GlassWater, "feeling"),
      word("frio", "Com frio", "com frio", Snowflake, "feeling"),
      word("calor", "Com calor", "com calor", Sun, "feeling"),
      word("dor", "Com dor", "com dor", HeartPulse, "feeling"),
    ],
  },

  {
    id: "mais",
    label: "Mais palavras",
    Icon: Plus,
    color: "#F0E5FF",
    words: [
      word("agora", "Agora", "agora", Clock3, "extra"),
      word("depois", "Depois", "depois", Clock3, "extra"),
      word("hoje", "Hoje", "hoje", CalendarDays, "extra"),
      word("amanha", "Amanhã", "amanhã", CalendarDays, "extra"),
      word("por-favor", "Por favor", "por favor", HeartHandshake, "extra"),
      word("sim", "Sim", "sim", Check, "extra"),
      word("nao", "Não", "não", X, "extra"),
      word("ola", "Olá", "olá", Hand, "extra"),
      word("tchau", "Tchau", "tchau", Hand, "extra"),
      word("obrigado", "Obrigado", "obrigado", Heart, "extra"),
      word("obrigada", "Obrigada", "obrigada", Heart, "extra"),
    ],
  },

  {
    id: "cartoes",
    label: "Meus cartões",
    Icon: MessageCircle,
    color: "#F2EBE4",
    words: [],
  },
];

// Índice usado para identificar as palavras da mensagem.
const wordById = new Map<string, MessageWord>(
  messageGroups.flatMap((group) =>
    group.words.map((entry): [string, MessageWord] => [entry.id, entry]),
  ),
);

function findWord(item: MessageItem): MessageWord | undefined {
  if (!item.cardId.startsWith("vocabulary-")) {
    return undefined;
  }

  const wordId = item.cardId.slice("vocabulary-".length);

  return wordById.get(wordId);
}

function getSelectedAction(items: MessageItem[]): string | null {
  const action = items.find((item) => findWord(item)?.role === "action");

  return action?.cardId.slice("vocabulary-".length) ?? null;
}

// Todas as pessoas do vocabulário, exceto "Eu",
// utilizam a conjugação da terceira pessoa singular.
function isThirdPerson(items: MessageItem[]): boolean {
  return items.some((item) => {
    const selectedWord = findWord(item);

    return selectedWord?.role === "subject" && selectedWord.id !== "eu";
  });
}

// Concordância das ações com os sujeitos.
const thirdPersonActions: Record<
  string,
  {
    label: string;
    speechText: string;
  }
> = {
  quero: {
    label: "Quer",
    speechText: "quer",
  },
  preciso: {
    label: "Precisa de",
    speechText: "precisa de",
  },
  estou: {
    label: "Está",
    speechText: "está",
  },
  gosto: {
    label: "Gosta de",
    speechText: "gosta de",
  },
  posso: {
    label: "Pode",
    speechText: "pode",
  },
  "nao-quero": {
    label: "Não quer",
    speechText: "não quer",
  },
  vou: {
    label: "Vai",
    speechText: "vai",
  },
  "nao-posso": {
    label: "Não pode",
    speechText: "não pode",
  },
  adoro: {
    label: "Adora",
    speechText: "adora",
  },
  "nao-gosto": {
    label: "Não gosta de",
    speechText: "não gosta de",
  },
};

// Define quais tipos de complemento fazem sentido
// depois de cada ação.
function allowedComplements(action: string | null): WordRole[] {
  switch (action) {
    case "preciso":
      // Preciso de água, ajuda, comida...
      return ["noun"];

    case "estou":
      // Estou feliz, com medo, com sono...
      return ["feeling"];

    case "posso":
    case "nao-posso":
    case "vou":
      // Posso brincar, não posso jogar, vou dormir...
      return ["activity"];

    case "quero":
    case "nao-quero":
    case "gosto":
    case "nao-gosto":
    case "adoro":
      // Quero água, quero brincar...
      return ["noun", "activity"];

    default:
      return [];
  }
}

/**
 * Determina quais grupos podem continuar
 * a frase em construção.
 */
export function availableMessageGroups(items: MessageItem[]): MessageGroupId[] {
  if (items.length === 0) {
    return ["quem", "acoes", "coisas", "sentimentos", "mais", "cartoes"];
  }

  // Cartões personalizados continuam funcionando
  // como mensagens independentes.
  if (items.some((item) => !findWord(item))) {
    return [];
  }

  const roles = items.map((item) => findWord(item)?.role);

  const action = getSelectedAction(items);

  // Um complemento adicional encerra a construção.
  if (roles.includes("extra")) {
    return [];
  }

  // Após objeto, atividade ou sentimento, pode ser
  // acrescentada uma expressão curta.
  const hasComplement = roles.some((role) =>
    ["noun", "activity", "feeling"].includes(role ?? ""),
  );

  if (hasComplement) {
    return action ? ["mais"] : [];
  }

  // Após uma ação, sugerimos o complemento correto.
  if (action) {
    return action === "estou" ? ["sentimentos"] : ["coisas"];
  }

  // Após um sujeito, sugerimos uma ação.
  if (roles.includes("subject")) {
    return ["acoes"];
  }

  return [];
}

export function suggestedMessageGroup(
  items: MessageItem[],
): MessageGroupId | null {
  return availableMessageGroups(items)[0] ?? null;
}

/**
 * Retorna somente palavras compatíveis
 * com a etapa atual da frase.
 */
export function availableMessageWords(
  groupId: MessageGroupId,
  items: MessageItem[],
): MessageWord[] {
  const group = messageGroups.find((entry) => entry.id === groupId);

  if (!group || !availableMessageGroups(items).includes(groupId)) {
    return [];
  }

  const action = getSelectedAction(items);
  const start = items.length === 0;

  return group.words
    .filter((entry) => {
      if (start) {
        // Permite frases de uma palavra e expressões
        // essenciais independentes.
        if (entry.role !== "extra") {
          return true;
        }

        return ["sim", "nao", "ola", "tchau", "obrigado", "obrigada"].includes(
          entry.id,
        );
      }

      if (entry.role === "action") {
        return true;
      }

      if (entry.role === "extra") {
        // Para sentimentos, usamos apenas
        // complementos temporais simples.
        if (action === "estou") {
          return ["agora", "hoje"].includes(entry.id);
        }

        return ["agora", "depois", "hoje", "amanha", "por-favor"].includes(
          entry.id,
        );
      }

      return allowedComplements(action).includes(entry.role);
    })
    .map((entry) => {
      if (entry.role !== "action" || !isThirdPerson(items)) {
        return entry;
      }

      const form = thirdPersonActions[entry.id];

      return form ? { ...entry, ...form } : entry;
    });
}

export function formatMessage(text: string): string {
  const clean = text.trim();

  if (!clean) {
    return "";
  }

  const sentence = clean.charAt(0).toLocaleUpperCase("pt-BR") + clean.slice(1);

  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
}
