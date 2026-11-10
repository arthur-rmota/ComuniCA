export interface QuickPhrase {
  id: string;
  userId: string | null;
  text: string;
  categoryId: string | null;
  position: number;
  icon: string;
  color: string;
}
