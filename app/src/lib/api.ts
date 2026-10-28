import type { ClosetItem, GarmentTags, Recommendation, StyleProfile } from '@/lib/types';

/** Closet items as the server sees them: tags only, never photos, to keep requests small. */
function slim(items: ClosetItem[]) {
  return items.map(({ imageUri: _imageUri, createdAt: _createdAt, ...rest }) => rest);
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    throw new Error(detail.error ?? `Request failed (${response.status})`);
  }
  return response.json();
}

export function tagGarment(base64: string, mediaType: string) {
  return post<{ tags: GarmentTags }>('/api/tag', { base64, mediaType });
}

export type GeneratedOutfit = { itemIds: string[]; title: string; reasoning: string };

export function generateOutfits(items: ClosetItem[], occasion: string, avoid: string[][]) {
  return post<{ outfits: GeneratedOutfit[]; source: 'ai' | 'rules' }>('/api/outfits', {
    items: slim(items),
    occasion,
    avoid,
  });
}

export function fetchRecommendations(items: ClosetItem[], profile: StyleProfile) {
  return post<{ recommendations: Recommendation[]; summary: string; source: 'ai' | 'rules' }>(
    '/api/explore',
    { items: slim(items), profile },
  );
}
