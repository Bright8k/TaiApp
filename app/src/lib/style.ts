import type { ClosetItem, GarmentTags, Product, Style, StyleProfile } from '@/lib/types';

const NEUTRALS = new Set([
  'black', 'white', 'grey', 'gray', 'navy', 'beige', 'cream', 'tan', 'khaki', 'brown', 'denim', 'camel', 'ivory',
]);

/** Families of colors that clash when worn together without a neutral to break them up. */
const CLASHES: [string, string][] = [
  ['red', 'pink'],
  ['red', 'orange'],
  ['orange', 'pink'],
  ['green', 'red'],
  ['purple', 'orange'],
];

function primaryColor(item: GarmentTags) {
  return item.colors[0]?.toLowerCase() ?? 'black';
}

export function isNeutral(color: string) {
  return NEUTRALS.has(color.toLowerCase());
}

/** Rough 0..1 score for how well a set of garments work together on color, style and formality. */
export function harmony(items: GarmentTags[]): number {
  const colors = items.map(primaryColor);
  const accents = [...new Set(colors.filter((c) => !isNeutral(c)))];
  let score = 1;

  if (accents.length > 2) score -= 0.4;
  for (const [a, b] of CLASHES) {
    if (accents.includes(a) && accents.includes(b)) score -= 0.3;
  }
  const patterned = items.filter((i) => i.pattern && i.pattern !== 'solid').length;
  if (patterned > 1) score -= 0.25;

  const formalities = items.map((i) => i.formality);
  score -= (Math.max(...formalities) - Math.min(...formalities)) * 0.1;

  const sharedStyle = items[0]?.styles.some((s) => items.every((i) => i.styles.includes(s)));
  if (sharedStyle) score += 0.15;

  return Math.max(0, Math.min(1, score));
}

export function buildStyleProfile(
  items: ClosetItem[],
  preferredStyles: Style[],
  likedProductIds: string[],
  dislikedProductIds: string[],
): StyleProfile {
  const styleCounts: StyleProfile['styleCounts'] = {};
  const colorCounts: StyleProfile['colorCounts'] = {};
  const categoryCounts: StyleProfile['categoryCounts'] = {};

  for (const item of items) {
    for (const s of item.styles) styleCounts[s] = (styleCounts[s] ?? 0) + 1;
    for (const c of item.colors) colorCounts[c.toLowerCase()] = (colorCounts[c.toLowerCase()] ?? 0) + 1;
    categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;
  }

  const avgFormality = items.length
    ? items.reduce((sum, i) => sum + i.formality, 0) / items.length
    : 2.5;

  return { preferredStyles, styleCounts, colorCounts, categoryCounts, avgFormality, likedProductIds, dislikedProductIds };
}

function pick<T>(list: T[]): T | undefined {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Offline outfit generator: samples many top+bottom (or dress) combinations, adds shoes and
 * optional layers, and keeps the most harmonious distinct ones.
 */
export function generateOutfitsLocally(items: ClosetItem[], count = 3): { itemIds: string[]; title: string; reasoning: string }[] {
  const by = (category: ClosetItem['category']) => items.filter((i) => i.category === category);
  const tops = by('top');
  const bottoms = by('bottom');
  const dresses = by('dress');
  const shoes = by('shoes');
  const outerwear = by('outerwear');
  const accessories = by('accessory');

  const candidates: { items: ClosetItem[]; score: number }[] = [];
  for (let attempt = 0; attempt < 200; attempt++) {
    const base: ClosetItem[] = [];
    const useDress = dresses.length > 0 && (tops.length === 0 || bottoms.length === 0 || Math.random() < 0.3);
    if (useDress) {
      base.push(pick(dresses)!);
    } else if (tops.length && bottoms.length) {
      base.push(pick(tops)!, pick(bottoms)!);
    } else {
      break;
    }
    if (shoes.length) base.push(pick(shoes)!);
    if (outerwear.length && Math.random() < 0.4) base.push(pick(outerwear)!);
    if (accessories.length && Math.random() < 0.4) base.push(pick(accessories)!);
    candidates.push({ items: base, score: harmony(base) });
  }

  const seen = new Set<string>();
  return candidates
    .sort((a, b) => b.score - a.score)
    .filter((c) => {
      const key = c.items.map((i) => i.id).sort().join('|');
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, count)
    .map((c) => {
      const style = c.items[0].styles.find((s) => c.items.every((i) => i.styles.includes(s)));
      const accent = c.items.map(primaryColor).find((col) => !isNeutral(col));
      return {
        itemIds: c.items.map((i) => i.id),
        title: style ? `Easy ${style}` : 'Everyday mix',
        reasoning: accent
          ? `Neutral base with ${accent} as the single accent, so nothing competes.`
          : 'An all-neutral palette that keeps the look clean and versatile.',
      };
    });
}

/**
 * Ranks shop products for a user. Rewards shared styles and favored colors, pushes categories
 * the closet is thin on, and penalizes near-duplicates of things they already own.
 */
export function scoreProducts(products: Product[], profile: StyleProfile, closet: GarmentTags[]) {
  const totalItems = Object.values(profile.categoryCounts).reduce((a, b) => a + (b ?? 0), 0) || 1;
  const topColors = Object.entries(profile.colorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([c]) => c);
  const liked = products.filter((p) => profile.likedProductIds.includes(p.id));

  return products
    .filter((p) => !profile.dislikedProductIds.includes(p.id))
    .map((product) => {
      let score = 0;
      for (const s of product.styles) {
        score += (profile.styleCounts[s] ?? 0) / totalItems;
        if (profile.preferredStyles.includes(s)) score += 0.6;
      }
      const color = primaryColor(product);
      if (topColors.includes(color)) score += 0.3;
      if (isNeutral(color)) score += 0.15;

      const owned = profile.categoryCounts[product.category] ?? 0;
      if (owned / totalItems < 0.12) score += 0.4;

      const duplicates = closet.filter(
        (c) => c.category === product.category && primaryColor(c) === color && c.pattern === product.pattern,
      ).length;
      score -= duplicates * 0.5;

      score -= Math.abs(product.formality - profile.avgFormality) * 0.15;

      for (const l of liked) {
        if (l.id !== product.id && l.styles.some((s) => product.styles.includes(s))) score += 0.2;
      }
      return { product, score };
    })
    .sort((a, b) => b.score - a.score);
}

export function topEntries<K extends string>(counts: Partial<Record<K, number>>, n: number): K[] {
  return (Object.entries(counts) as [K, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([k]) => k);
}
