import type { Category } from "../../types/category";

export const defaultCategories: Category[] = [
  {
    id: "cat-001",
    name: "Básicos",
    icon: "hand-heart",
    color: "#A8D49A",
    description: "Expressar necessidades básicas",
    ownerId: null,
    position: 1,
  },
  {
    id: "cat-002",
    name: "Alimentação",
    icon: "utensils",
    color: "#A8D5BA",
    description: "Expressar desejos relacionados à alimentação",
    ownerId: null,
    position: 2,
  },
  {
    id: "cat-003",
    name: "Emoções",
    icon: "heart",
    color: "#F4A6A6",
    description: "Comunicar sentimentos e emoções",
    ownerId: null,
    position: 3,
  },
  {
    id: "cat-004",
    name: "Emergência",
    icon: "siren",
    color: "#F59A9D",
    description: "Comunicar situações de emergência e pedir ajuda",
    ownerId: null,
    position: 4,
  },
];
