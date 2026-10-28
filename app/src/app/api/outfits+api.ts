import { z } from 'zod';

import { generateOutfitsLocally } from '@/lib/style';
import type { ClosetItem } from '@/lib/types';
import { errorResponse, getClient, parseStructured } from '@/server/claude';
import { ClosetItemInputSchema } from '@/server/schemas';

const RequestSchema = z.object({
  items: z.array(ClosetItemInputSchema).min(2),
  occasion: z.string().max(200),
  avoid: z.array(z.array(z.string())).max(50),
});

const OutfitsSchema = z.object({
  outfits: z.array(
    z.object({
      title: z.string().describe('2-4 word name for the look'),
      itemIds: z.array(z.string()).describe('ids of the closet items in this outfit'),
      reasoning: z.string().describe('One or two sentences on why the pieces work together'),
    }),
  ),
});

const SYSTEM = `You are a personal stylist building outfits only from the user's own closet.
Every outfit needs a complete base: a top with a bottom, or a dress. Add shoes whenever the closet has any, and add outerwear or accessories only when they improve the look or suit the occasion.
Use only item ids from the closet list. Make the outfits meaningfully different from each other and from the combinations listed under "already suggested".`;

export async function POST(request: Request) {
  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: 'Add at least two items to your closet first.' }, { status: 400 });
  const { items, occasion, avoid } = parsed.data;

  const anthropic = getClient();
  if (!anthropic) {
    const outfits = generateOutfitsLocally(items as ClosetItem[], 3);
    return Response.json({ outfits, source: 'rules' });
  }

  try {
    const closet = items.map((i) => JSON.stringify(i)).join('\n');
    const result = await parseStructured(anthropic, {
      schema: OutfitsSchema,
      system: SYSTEM,
      effort: 'medium',
      content: [
        {
          type: 'text',
          text: `<closet>\n${closet}\n</closet>\n<already_suggested>\n${avoid.map((ids) => ids.join(', ')).join('\n') || 'none'}\n</already_suggested>\nOccasion: ${occasion || 'everyday'}\n\nSuggest 3 outfits.`,
        },
      ],
    });

    const validIds = new Set(items.map((i) => i.id));
    const outfits = result.outfits
      .map((o) => ({ ...o, itemIds: [...new Set(o.itemIds.filter((id) => validIds.has(id)))] }))
      .filter((o) => o.itemIds.length >= 2);
    return Response.json({ outfits, source: 'ai' });
  } catch (error) {
    return errorResponse(error);
  }
}
