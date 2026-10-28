import { useSyncExternalStore } from 'react';

import { storage } from '@/lib/storage';
import type { ClosetItem, Outfit, Style } from '@/lib/types';

type State = {
  items: ClosetItem[];
  outfits: Outfit[];
  preferredStyles: Style[];
  likedProductIds: string[];
  dislikedProductIds: string[];
};

const STORAGE_KEY = 'closet-state-v1';

const initialState: State = {
  items: [],
  outfits: [],
  preferredStyles: [],
  likedProductIds: [],
  dislikedProductIds: [],
};

function load(): State {
  try {
    const raw = storage.get(STORAGE_KEY);
    return raw ? { ...initialState, ...JSON.parse(raw) } : initialState;
  } catch {
    return initialState;
  }
}

let state = load();
const listeners = new Set<() => void>();

function setState(update: (prev: State) => State) {
  state = update(state);
  storage.set(STORAGE_KEY, JSON.stringify(state));
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useStore<T>(selector: (state: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state));
}

export function getState() {
  return state;
}

export function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const actions = {
  addItem(item: ClosetItem) {
    setState((s) => ({ ...s, items: [item, ...s.items] }));
  },
  updateItem(id: string, patch: Partial<ClosetItem>) {
    setState((s) => ({
      ...s,
      items: s.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  },
  removeItem(id: string) {
    setState((s) => ({
      ...s,
      items: s.items.filter((item) => item.id !== id),
      // An outfit missing a piece is no longer an outfit.
      outfits: s.outfits.filter((outfit) => !outfit.itemIds.includes(id)),
    }));
  },
  saveOutfit(outfit: Omit<Outfit, 'id' | 'createdAt'>) {
    const saved = { ...outfit, id: newId(), createdAt: Date.now() };
    setState((s) => ({ ...s, outfits: [saved, ...s.outfits] }));
  },
  removeOutfit(id: string) {
    setState((s) => ({ ...s, outfits: s.outfits.filter((outfit) => outfit.id !== id) }));
  },
  togglePreferredStyle(style: Style) {
    setState((s) => ({
      ...s,
      preferredStyles: s.preferredStyles.includes(style)
        ? s.preferredStyles.filter((x) => x !== style)
        : [...s.preferredStyles, style],
    }));
  },
  rateProduct(id: string, rating: 'like' | 'dislike' | null) {
    setState((s) => ({
      ...s,
      likedProductIds: rating === 'like'
        ? [...new Set([...s.likedProductIds, id])]
        : s.likedProductIds.filter((x) => x !== id),
      dislikedProductIds: rating === 'dislike'
        ? [...new Set([...s.dislikedProductIds, id])]
        : s.dislikedProductIds.filter((x) => x !== id),
    }));
  },
};
