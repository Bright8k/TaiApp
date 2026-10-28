import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ProductCard } from '@/components/garments';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Button, Chip } from '@/components/ui/controls';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { fetchRecommendations } from '@/lib/api';
import { actions, getState, useStore } from '@/lib/store';
import { buildStyleProfile } from '@/lib/style';
import { Styles, type ClosetItem, type Recommendation, type Style } from '@/lib/types';

type ExploreResult = {
  recommendations: Recommendation[];
  summary: string;
  error: string | null;
  request: readonly [ClosetItem[], Style[], number];
};

export default function ExploreScreen() {
  const theme = useTheme();
  const items = useStore((s) => s.items);
  const preferredStyles = useStore((s) => s.preferredStyles);
  const liked = useStore((s) => s.likedProductIds);
  const disliked = useStore((s) => s.dislikedProductIds);
  const [refreshCount, setRefreshCount] = useState(0);
  const [result, setResult] = useState<ExploreResult | null>(null);

  // Loading until a response arrives for exactly these inputs.
  const request = [items, preferredStyles, refreshCount] as const;
  const loading = !result || result.request.some((dep, i) => dep !== request[i]);
  const recommendations = result?.recommendations ?? [];

  // Re-rank whenever the closet or stated taste changes, or on manual refresh. Ratings only apply
  // on refresh so cards don't jump around while the user is tapping through them.
  useEffect(() => {
    let cancelled = false;
    const { likedProductIds, dislikedProductIds } = getState();
    const profile = buildStyleProfile(items, preferredStyles, likedProductIds, dislikedProductIds);
    fetchRecommendations(items, profile).then(
      (response) => {
        if (!cancelled) setResult({ ...response, error: null, request: [items, preferredStyles, refreshCount] });
      },
      (e: unknown) => {
        if (cancelled) return;
        const error = e instanceof Error ? e.message : 'Could not load recommendations.';
        setResult((prev) => ({
          recommendations: prev?.recommendations ?? [],
          summary: prev?.summary ?? '',
          error,
          request: [items, preferredStyles, refreshCount],
        }));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [items, preferredStyles, refreshCount]);

  const summary = result?.summary;
  const error = result?.error;

  return (
    <Screen
      title="Explore"
      subtitle={summary || 'Pieces picked for your closet and taste.'}
      action={<Button label="Refresh" variant="secondary" onPress={() => setRefreshCount((n) => n + 1)} loading={loading} />}>
      <View style={styles.section}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          Styles you love
        </ThemedText>
        <View style={styles.row}>
          {Styles.map((s) => (
            <Chip key={s} label={s} selected={preferredStyles.includes(s)} onPress={() => actions.togglePreferredStyle(s)} />
          ))}
        </View>
      </View>

      {error && (
        <ThemedText type="small" style={{ color: theme.danger }}>
          {error}
        </ThemedText>
      )}
      {loading && recommendations.length === 0 && <ActivityIndicator color={theme.accent} />}

      {recommendations.map((rec) => (
        <ProductCard
          key={rec.product.id}
          recommendation={rec}
          closet={items}
          rating={liked.includes(rec.product.id) ? 'like' : disliked.includes(rec.product.id) ? 'dislike' : null}
          onRate={(rating) => actions.rateProduct(rec.product.id, rating)}
        />
      ))}

      <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
        Showing a demo catalog. Connect a product feed to show real items.
      </ThemedText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  note: {
    textAlign: 'center',
  },
});
