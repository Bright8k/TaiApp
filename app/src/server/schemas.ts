import { z } from 'zod';

import { Categories, Seasons, Styles } from '@/lib/types';

export const GarmentTagsSchema = z.object({
  name: z.string().describe('Short shopper-friendly name, e.g. "Cropped denim jacket"'),
  category: z.enum(Categories),
  colors: z.array(z.string()).describe('Plain lowercase color names, dominant color first'),
  pattern: z.string().describe('"solid", "striped", "floral", "plaid", "graphic", etc.'),
  styles: z.array(z.enum(Styles)).describe('1-3 styles this piece fits'),
  seasons: z.array(z.enum(Seasons)),
  formality: z.number().int().describe('1 = loungewear, 2 = casual, 3 = smart casual, 4 = business/dressy, 5 = black tie'),
});

export const ClosetItemInputSchema = GarmentTagsSchema.extend({ id: z.string() });

export const StyleProfileSchema = z.object({
  preferredStyles: z.array(z.enum(Styles)),
  styleCounts: z.record(z.string(), z.number()),
  colorCounts: z.record(z.string(), z.number()),
  categoryCounts: z.record(z.string(), z.number()),
  avgFormality: z.number(),
  likedProductIds: z.array(z.string()),
  dislikedProductIds: z.array(z.string()),
});
