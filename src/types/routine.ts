
export type RoutinePeriod = "morning" | "afternoon" | "night";

export interface RoutineSection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  position: number;
}

export interface RoutineActivity {
  id: string;
  sectionId: string;
  title: string;
  icon: string;
  period: RoutinePeriod;
  time: string | null;
  position: number;
  linkedCardIds: string[];
  linkedQuickPhraseIds: string[];
}
