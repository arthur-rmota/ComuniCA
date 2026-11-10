export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  ownerId: string | null;
  position: number;
}