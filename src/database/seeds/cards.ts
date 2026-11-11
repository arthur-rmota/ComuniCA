
import type { Card } from "../../types/card";

export const defaultCards: Card[] = [
  {
    id: "card-001",
    title: "Água",
    image: null,
    altText: "Copo com água",
    speechText: "Quero água",
    categoryId: "cat-001",
    ownerId: null,
    keywords: ["água", "beber", "sede"],
    isActive: true,
  },
  {
    id: "card-002",
    title: "Comida",
    image: null,
    altText: "Prato com comida",
    speechText: "Quero comer",
    categoryId: "cat-002",
    ownerId: null,
    keywords: ["comida", "comer", "fome"],
    isActive: true,
  },
  {
    id: "card-003",
    title: "Feliz",
    image: null,
    altText: "Rosto demonstrando felicidade",
    speechText: "Estou feliz",
    categoryId: "cat-003",
    ownerId: null,
    keywords: ["feliz", "alegria", "bem"],
    isActive: true,
  },
];
