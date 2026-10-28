import type { Product } from '@/lib/types';

/**
 * Demo catalog so Explore works end to end. In production, replace `getCatalog` with a query
 * against an affiliate product feed (e.g. ShopStyle Collective, Rakuten, Impact) synced into
 * your database, and return real product photos and affiliate links.
 */
type Seed = Omit<Product, 'id' | 'url'>;

const seeds: Seed[] = [
  { name: 'Relaxed oxford shirt', brand: 'Basics', price: 48, category: 'top', colors: ['white'], pattern: 'solid', styles: ['classic', 'preppy', 'minimalist'], seasons: ['spring', 'summer', 'fall'], formality: 3, swatch: '#F4F4F2' },
  { name: 'Heavyweight boxy tee', brand: 'Basics', price: 28, category: 'top', colors: ['black'], pattern: 'solid', styles: ['streetwear', 'minimalist', 'casual'], seasons: ['spring', 'summer', 'fall'], formality: 1, swatch: '#1C1C1C' },
  { name: 'Merino crewneck sweater', brand: 'Studio', price: 89, category: 'top', colors: ['camel'], pattern: 'solid', styles: ['classic', 'minimalist'], seasons: ['fall', 'winter'], formality: 3, swatch: '#C19A6B' },
  { name: 'Striped Breton top', brand: 'Studio', price: 54, category: 'top', colors: ['navy', 'white'], pattern: 'striped', styles: ['classic', 'preppy', 'casual'], seasons: ['spring', 'summer'], formality: 2, swatch: '#2B3A67' },
  { name: 'Floral peasant blouse', brand: 'Meadow', price: 62, category: 'top', colors: ['cream', 'pink'], pattern: 'floral', styles: ['bohemian', 'romantic'], seasons: ['spring', 'summer'], formality: 2, swatch: '#F3E3D3' },
  { name: 'Graphic hoodie', brand: 'Corner', price: 70, category: 'top', colors: ['grey'], pattern: 'graphic', styles: ['streetwear', 'casual'], seasons: ['fall', 'winter'], formality: 1, swatch: '#8E8E93' },
  { name: 'Silk camisole', brand: 'Atelier', price: 95, category: 'top', colors: ['ivory'], pattern: 'solid', styles: ['romantic', 'minimalist'], seasons: ['spring', 'summer'], formality: 3, swatch: '#FFFFF0' },
  { name: 'Seamless training top', brand: 'Motion', price: 45, category: 'top', colors: ['green'], pattern: 'solid', styles: ['athleisure'], seasons: ['spring', 'summer', 'fall'], formality: 1, swatch: '#4F7942' },
  { name: 'Straight-leg jeans', brand: 'Basics', price: 78, category: 'bottom', colors: ['denim'], pattern: 'solid', styles: ['casual', 'classic', 'streetwear'], seasons: ['spring', 'fall', 'winter'], formality: 2, swatch: '#4A6FA5' },
  { name: 'Pleated wool trousers', brand: 'Studio', price: 120, category: 'bottom', colors: ['grey'], pattern: 'solid', styles: ['business', 'classic', 'minimalist'], seasons: ['fall', 'winter'], formality: 4, swatch: '#6E6E73' },
  { name: 'Cargo parachute pants', brand: 'Corner', price: 85, category: 'bottom', colors: ['khaki'], pattern: 'solid', styles: ['streetwear', 'edgy'], seasons: ['spring', 'fall'], formality: 1, swatch: '#BDB76B' },
  { name: 'Tiered maxi skirt', brand: 'Meadow', price: 74, category: 'bottom', colors: ['brown'], pattern: 'solid', styles: ['bohemian', 'romantic'], seasons: ['spring', 'summer', 'fall'], formality: 2, swatch: '#8B5A2B' },
  { name: 'Chino shorts', brand: 'Basics', price: 42, category: 'bottom', colors: ['navy'], pattern: 'solid', styles: ['preppy', 'casual'], seasons: ['summer'], formality: 2, swatch: '#1F2A44' },
  { name: 'Flared yoga pants', brand: 'Motion', price: 58, category: 'bottom', colors: ['black'], pattern: 'solid', styles: ['athleisure', 'casual'], seasons: ['spring', 'summer', 'fall', 'winter'], formality: 1, swatch: '#111111' },
  { name: 'Slip midi dress', brand: 'Atelier', price: 110, category: 'dress', colors: ['black'], pattern: 'solid', styles: ['minimalist', 'romantic', 'classic'], seasons: ['spring', 'summer', 'fall'], formality: 4, swatch: '#151515' },
  { name: 'Wrap dress', brand: 'Studio', price: 98, category: 'dress', colors: ['green'], pattern: 'solid', styles: ['classic', 'romantic', 'business'], seasons: ['spring', 'fall'], formality: 3, swatch: '#2E5E4E' },
  { name: 'Prairie floral dress', brand: 'Meadow', price: 88, category: 'dress', colors: ['blue', 'white'], pattern: 'floral', styles: ['bohemian', 'romantic'], seasons: ['spring', 'summer'], formality: 2, swatch: '#7FA7D9' },
  { name: 'Wool overcoat', brand: 'Studio', price: 240, category: 'outerwear', colors: ['camel'], pattern: 'solid', styles: ['classic', 'business', 'minimalist'], seasons: ['fall', 'winter'], formality: 4, swatch: '#B5895A' },
  { name: 'Cropped leather jacket', brand: 'Atelier', price: 260, category: 'outerwear', colors: ['black'], pattern: 'solid', styles: ['edgy', 'streetwear'], seasons: ['spring', 'fall'], formality: 2, swatch: '#202020' },
  { name: 'Denim trucker jacket', brand: 'Basics', price: 90, category: 'outerwear', colors: ['denim'], pattern: 'solid', styles: ['casual', 'classic'], seasons: ['spring', 'fall'], formality: 2, swatch: '#5B7DB1' },
  { name: 'Quilted puffer vest', brand: 'Motion', price: 95, category: 'outerwear', colors: ['olive'], pattern: 'solid', styles: ['athleisure', 'casual', 'preppy'], seasons: ['fall', 'winter'], formality: 1, swatch: '#6B6B3A' },
  { name: 'Unstructured blazer', brand: 'Studio', price: 165, category: 'outerwear', colors: ['navy'], pattern: 'solid', styles: ['business', 'classic', 'preppy'], seasons: ['spring', 'fall', 'winter'], formality: 4, swatch: '#22304F' },
  { name: 'White leather sneakers', brand: 'Basics', price: 110, category: 'shoes', colors: ['white'], pattern: 'solid', styles: ['minimalist', 'casual', 'streetwear'], seasons: ['spring', 'summer', 'fall'], formality: 2, swatch: '#FAFAFA' },
  { name: 'Chelsea boots', brand: 'Atelier', price: 180, category: 'shoes', colors: ['brown'], pattern: 'solid', styles: ['classic', 'edgy'], seasons: ['fall', 'winter'], formality: 3, swatch: '#5C3A21' },
  { name: 'Leather loafers', brand: 'Studio', price: 150, category: 'shoes', colors: ['black'], pattern: 'solid', styles: ['preppy', 'business', 'classic'], seasons: ['spring', 'fall', 'winter'], formality: 4, swatch: '#1A1A1A' },
  { name: 'Strappy flat sandals', brand: 'Meadow', price: 60, category: 'shoes', colors: ['tan'], pattern: 'solid', styles: ['bohemian', 'casual'], seasons: ['summer'], formality: 2, swatch: '#D2B48C' },
  { name: 'Retro running shoes', brand: 'Motion', price: 95, category: 'shoes', colors: ['grey'], pattern: 'colorblock', styles: ['athleisure', 'streetwear'], seasons: ['spring', 'summer', 'fall'], formality: 1, swatch: '#A0A0A5' },
  { name: 'Leather crossbody bag', brand: 'Atelier', price: 140, category: 'accessory', colors: ['tan'], pattern: 'solid', styles: ['classic', 'minimalist'], seasons: ['spring', 'summer', 'fall', 'winter'], formality: 3, swatch: '#C8A27A' },
  { name: 'Silver chain necklace', brand: 'Atelier', price: 55, category: 'accessory', colors: ['silver'], pattern: 'solid', styles: ['edgy', 'minimalist', 'streetwear'], seasons: ['spring', 'summer', 'fall', 'winter'], formality: 2, swatch: '#C0C0C0' },
  { name: 'Wool beanie', brand: 'Corner', price: 25, category: 'accessory', colors: ['black'], pattern: 'solid', styles: ['streetwear', 'casual'], seasons: ['fall', 'winter'], formality: 1, swatch: '#232323' },
  { name: 'Silk neck scarf', brand: 'Studio', price: 45, category: 'accessory', colors: ['red'], pattern: 'printed', styles: ['classic', 'romantic', 'preppy'], seasons: ['spring', 'fall'], formality: 3, swatch: '#A4262C' },
  { name: 'Woven straw tote', brand: 'Meadow', price: 65, category: 'accessory', colors: ['beige'], pattern: 'woven', styles: ['bohemian', 'casual'], seasons: ['spring', 'summer'], formality: 2, swatch: '#E1C699' },
];

const catalog: Product[] = seeds.map((seed, index) => ({
  ...seed,
  id: `demo-${index + 1}`,
  url: `https://www.google.com/search?tbm=shop&q=${encodeURIComponent(seed.name)}`,
}));

export async function getCatalog(): Promise<Product[]> {
  return catalog;
}
