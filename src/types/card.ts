export interface Card {
  id: string;
  title: string;
  image: string | null;
  altText: string;
  speechText: string;
  categoryId: string;
  ownerId: string | null;
  keywords: string[];
  isActive: boolean;
  icon?: string;
}
