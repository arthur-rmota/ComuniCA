
import type { RoutineActivity } from "../../types/routine";

export const defaultRoutineActivities: RoutineActivity[] = [
  // ESCOLA
  {
    id: "demo-routine-class",
    sectionId: "routine-school",
    title: "Aula",
    icon: "book-open",
    period: "morning",
    time: null,
    position: 1,
    linkedCardIds: ["card-001"],
    linkedQuickPhraseIds: ["quick-017", "quick-007"],
  },
  {
    id: "demo-routine-snack",
    sectionId: "routine-school",
    title: "Lanche",
    icon: "sandwich",
    period: "morning",
    time: null,
    position: 2,
    linkedCardIds: ["card-001", "card-002"],
    linkedQuickPhraseIds: ["quick-017", "quick-018"],
  },

  // CASA
  {
    id: "demo-routine-meal",
    sectionId: "routine-home",
    title: "Hora de comer",
    icon: "utensils",
    period: "afternoon",
    time: null,
    position: 1,
    linkedCardIds: ["card-001", "card-002"],
    linkedQuickPhraseIds: ["quick-016"],
  },

  // TERAPIA
  {
    id: "demo-routine-therapy",
    sectionId: "routine-therapy",
    title: "Sessão de terapia",
    icon: "hand-heart",
    period: "afternoon",
    time: null,
    position: 1,
    linkedCardIds: ["card-003"],
    linkedQuickPhraseIds: ["quick-017", "quick-018"],
  },

  // LAZER
  {
    id: "demo-routine-play",
    sectionId: "routine-leisure",
    title: "Hora de brincar",
    icon: "gamepad-2",
    period: "afternoon",
    time: null,
    position: 1,
    linkedCardIds: ["card-001", "card-003"],
    linkedQuickPhraseIds: ["quick-017", "quick-018"],
  },
];
