
import type { RoutineSection } from "../../types/routine";

export const defaultRoutineSections: RoutineSection[] = [
  {
    id: "routine-school",
    name: "Escola",
    description: "Aulas, lanche e atividades",
    icon: "school",
    color: "#DDEBFA",
    position: 1,
  },
  {
    id: "routine-home",
    name: "Casa",
    description: "Cuidados e tarefas do dia",
    icon: "house",
    color: "#FFF0D6",
    position: 2,
  },
  {
    id: "routine-therapy",
    name: "Terapia",
    description: "Sessões e acompanhamentos",
    icon: "hand-heart",
    color: "#DDEFE3",
    position: 3,
  },
  {
    id: "routine-leisure",
    name: "Lazer",
    description: "Passeios e momentos de diversão",
    icon: "gamepad-2",
    color: "#EBE1FA",
    position: 4,
  },
];
