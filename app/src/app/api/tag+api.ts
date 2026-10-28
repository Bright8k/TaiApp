import { z } from 'zod';

import { errorResponse, getClient, parseStructured } from '@/server/claude';
import { GarmentTagsSchema } from '@/server/schemas';

const RequestSchema = z.object({
  base64: z.string().min(1),
  mediaType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
});

const SYSTEM = `You catalog clothing for a personal wardrobe app. Given one photo of a single garment, describe that garment so it can later be matched into outfits. If several items are visible, describe the most prominent one. Use common color names (e.g. "navy", not "midnight sapphire").`;

export async function POST(request: Request) {
  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: 'Invalid image upload.' }, { status: 400 });

  const anthropic = getClient();
  if (!anthropic) {
    return Response.json({ error: 'Auto-tagging is not configured. Fill the details in manually.' }, { status: 503 });
  }

  try {
    const tags = await parseStructured(anthropic, {
      schema: GarmentTagsSchema,
      system: SYSTEM,
      effort: 'low',
      content: [
        { type: 'image', source: { type: 'base64', media_type: parsed.data.mediaType, data: parsed.data.base64 } },
        { type: 'text', text: 'Tag this garment.' },
      ],
    });
    return Response.json({
      tags: { ...tags, formality: Math.min(5, Math.max(1, tags.formality)) },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
