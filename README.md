# Closet

A mobile app that catalogs your wardrobe, styles outfits from what you own, and recommends new pieces that fit your taste.

## Stack

| Layer | Choice | Why |
|---|---|---|
| App | **Expo (React Native + TypeScript), Expo Router** | One codebase for iOS + Android (and a web preview), first-class camera/photo APIs, over-the-air updates and cloud builds via EAS. No Xcode/Android Studio needed to ship. |
| Backend | **Expo Router API routes** (`src/app/api/*+api.ts`), deployed to **EAS Hosting** | The backend lives in the same repo and language as the app, and keeps the AI key off the device. No separate server project to maintain. |
| AI | **Claude (`claude-opus-5-5`)** with structured outputs | One model handles all three jobs: reading a garment photo into tags, styling outfits, and picking and explaining recommendations. Responses are schema-validated JSON. |
| On-device data | `expo-sqlite` key-value store + `expo-file-system` for photos | Works offline and needs no account to start. |

Every AI feature has a rule-based fallback (`src/lib/style.ts`), so the app still works without an API key. Tagging falls back to manual entry.

## Run it

```bash
cd app
npm install
cp .env.example .env        # add ANTHROPIC_API_KEY to turn on the AI features
npx expo start              # press i / a for a simulator, or scan the QR code with Expo Go
```

Typecheck and lint with `npx tsc --noEmit` and `npx expo lint`.

## How it works

- **Closet** (`src/app/(tabs)/index.tsx`): photograph an item. `POST /api/tag` sends the photo to Claude, which returns its category, colors, pattern, styles, seasons, and formality. You can edit any of the tags.
- **Outfits** (`src/app/(tabs)/outfits.tsx`): pick an occasion. `POST /api/outfits` sends only the closet *tags* (no photos, so it's cheap) and gets back three looks with reasons. Item ids are checked against the closet before anything is shown.
- **Explore** (`src/app/(tabs)/explore.tsx`): builds a style profile from the closet, the styles you choose, and ♥ / "Not me" ratings. `POST /api/explore` scores the catalog in code (taste match, closet gaps, near-duplicates), then Claude re-ranks the top 24 and explains each pick, including which of your items it goes with.

## Path to production

1. **Real product feed.** `src/server/catalog.ts` is a demo catalog. Swap `getCatalog()` for an affiliate network feed (ShopStyle Collective, Rakuten, Impact, etc.) synced into a database. Real product photos and affiliate links are also the revenue model.
2. **Accounts + cloud sync.** Add Supabase (Postgres, auth, storage for photos). Move the store in `src/lib/store.ts` behind it.
3. **Scale recommendations.** With a large catalog, store embeddings in pgvector, retrieve candidates by similarity to the user's profile, and keep Claude for the final re-rank and explanations.
4. **Nice-to-haves.** Background removal on item photos, weather-aware outfits, a wear log ("worn 3 times"), and an outfit calendar.
5. **Ship.** `npx eas-cli@latest build` for the app stores and `npx expo export --platform web && npx eas-cli@latest deploy` for the API routes. Set `ANTHROPIC_API_KEY` as an EAS Hosting secret and set the `origin` option on the `expo-router` plugin in `app.json`.
