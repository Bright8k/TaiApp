import { z } from 'zod';

import { scoreProducts, topEntries } from '@/lib/style';
import type { Recommendation, StyleProfile } from '@/lib/types';
import { getCatalog } from '@/server/catalog';
import { errorResponse, getClient, parseStructured } from '@/server/claude';
import { ClosetItemInputSchema, StyleProfileSchema } from '@/server/schemas';

const RequestSchema = z.object({
  items: z.array(ClosetItemInputSchema),
  profile: StyleProfileSchema,
});

const PicksSchema = z.object({
  summary: z.string().describe("One sentence describing the user's style as you read it, addressed to them"),
  picks: z.array(
    z.object({
      productId: z.string(),
      reason: z.string().describe('One sentence, specific to their closet, on why this piece suits them'),
      pairsWith: z.array(z.string()).describe('ids of 1-3 closet items it would be worn with'),
    }),
  ),
});

const SYSTEM = `You are a personal stylist recommending things to buy. You see the user's closet, their style profile, and a shortlist of candidate products already filtered for fit.
Choose the products that would add the most to this wardrobe: pieces that match their taste and unlock new outfits with what they own, favoring gaps over near-duplicates. Order picks best first.`;

const CANDIDATES = 24;
const PICKS = 12;

export async function POST(request: Request) {
  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: 'Invalid request.' }, { status: 400 });
  const { items } = parsed.data;
  const profile = parsed.data.profile as StyleProfile;

  const ranked = scoreProducts(await getCatalog(), profile, items).slice(0, CANDIDATES);
  const tasteWords = [...new Set([...profile.preferredStyles, ...topEntries(profile.styleCounts, 2)])];

  const anthropic = getClient();
  if (!anthropic || items.length === 0) {
    const recommendations: Recommendation[] = ranked.slice(0, PICKS).map(({ product, score }) => ({
      product,
      score,
      reason: product.styles.some((s) => tasteWords.includes(s))
        ? `Fits your ${product.styles.find((s) => tasteWords.includes(s))} style.`
        : `A versatile ${product.category} to round out your closet.`,
      pairsWith: [],
    }));
    return Response.json({
      recommendations,
      summary: tasteWords.length ? `Picked for your ${tasteWords.join(', ')} taste.` : 'Popular staples to start with.',
      source: 'rules',
    });
  }

  try {
    const closet = items.map((i) => JSON.stringify(i)).join('\n');
    const candidates = ranked.map(({ product: { swatch: _swatch, url: _url, ...p } }) => JSON.stringify(p)).join('\n');
    const result = await parseStructured(anthropic, {
      schema: PicksSchema,
      system: SYSTEM,
      effort: 'medium',
      content: [
        {
          type: 'text',
          text: `<closet>\n${closet}\n</closet>\n<profile>\n${JSON.stringify({
            preferredStyles: profile.preferredStyles,
            styleCounts: profile.styleCounts,
            colorCounts: profile.colorCounts,
            avgFormality: profile.avgFormality,
          })}\n</profile>\n<candidates>\n${candidates}\n</candidates>\n\nPick up to ${PICKS} products.`,
        },
      ],
    });

    const byId = new Map(ranked.map((r) => [r.product.id, r]));
    const closetIds = new Set(items.map((i) => i.id));
    const seen = new Set<string>();
    const recommendations: Recommendation[] = result.picks.flatMap((pick) => {
      const match = byId.get(pick.productId);
      if (!match || seen.has(pick.productId)) return [];
      seen.add(pick.productId);
      return [{ ...match, reason: pick.reason, pairsWith: pick.pairsWith.filter((id) => closetIds.has(id)) }];
    });
    return Response.json({ recommendations, summary: result.summary, source: 'ai' });
  } catch (error) {
    return errorResponse(error);
  }
}
