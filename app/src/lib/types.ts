export const Categories = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessory'] as const;
export type Category = (typeof Categories)[number];

export const Styles = [
  'casual',
  'minimalist',
  'streetwear',
  'classic',
  'business',
  'bohemian',
  'athleisure',
  'romantic',
  'edgy',
  'preppy',
] as const;
export type Style = (typeof Styles)[number];

export const Seasons = ['spring', 'summer', 'fall', 'winter'] as const;
export type Season = (typeof Seasons)[number];

/** Tags describing a garment. Shared by closet items and shop products so they can be compared. */
export type GarmentTags = {
  name: string;
  category: Category;
  colors: string[];
  pattern: string;
  styles: Style[];
  seasons: Season[];
  /** 1 = loungewear, 5 = black tie */
  formality: number;
};

export type ClosetItem = GarmentTags & {
  id: string;
  imageUri: string;
  createdAt: number;
};

export type Outfit = {
  id: string;
  title: string;
  itemIds: string[];
  reasoning: string;
  occasion: string;
  createdAt: number;
};

export type Product = GarmentTags & {
  id: string;
  brand: string;
  price: number;
  /** Hex used for the product tile until a real product feed with photos is connected. */
  swatch: string;
  url: string;
};

export type Recommendation = {
  product: Product;
  score: number;
  reason: string;
  pairsWith: string[];
};

export type StyleProfile = {
  preferredStyles: Style[];
  styleCounts: Partial<Record<Style, number>>;
  colorCounts: Record<string, number>;
  categoryCounts: Partial<Record<Category, number>>;
  avgFormality: number;
  likedProductIds: string[];
  dislikedProductIds: string[];
};
