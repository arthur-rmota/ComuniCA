
import type { EmergencyPhrase } from "../../types/emergencyPhrase";

export const defaultEmergencyPhrases: EmergencyPhrase[] = [
  {
    id: "emergency-help",
    text: "Preciso de ajuda",
    speechText: "Preciso de ajuda!",
    icon: "life-buoy",
    position: 1,
  },
  {
    id: "emergency-pain",
    text: "Estou com dor",
    speechText: "Estou com dor!",
    icon: "heart-pulse",
    position: 2,
  },
  {
    id: "emergency-call",
    text: "Chame alguém",
    speechText: "Por favor, chame alguém!",
    icon: "phone-call",
    position: 3,
  },
  {
    id: "emergency-unwell",
    text: "Não estou bem",
    speechText: "Não estou me sentindo bem!",
    icon: "alert-triangle",
    position: 4,
  },
];
