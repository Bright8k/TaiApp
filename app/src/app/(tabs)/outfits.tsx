import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { OutfitCard } from '@/components/garments';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Button, Chip, Field } from '@/components/ui/controls';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { generateOutfits, type GeneratedOutfit } from '@/lib/api';
import { actions, useStore } from '@/lib/store';
import type { ClosetItem } from '@/lib/types';

const OCCASIONS = ['Everyday', 'Work', 'Date night', 'Weekend', 'Going out', 'Travel'];

export default function OutfitsScreen() {
  const theme = useTheme();
  const items = useStore((s) => s.items);
  const saved = useStore((s) => s.outfits);
  const [occasion, setOccasion] = useState('Everyday');
  const [suggestions, setSuggestions] = useState<GeneratedOutfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const byId = new Map(items.map((i) => [i.id, i]));
  const resolve = (ids: string[]) => ids.map((id) => byId.get(id)).filter((i): i is ClosetItem => !!i);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const avoid = [...saved.map((o) => o.itemIds), ...suggestions.map((o) => o.itemIds)];
      const { outfits } = await generateOutfits(items, occasion, avoid);
      setSuggestions(outfits);
      if (outfits.length === 0) setError('Add more tops, bottoms or dresses to build complete outfits.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  function save(outfit: GeneratedOutfit) {
    actions.saveOutfit({ ...outfit, occasion });
    setSuggestions((list) => list.filter((o) => o !== outfit));
  }

  return (
    <Screen title="Outfits" subtitle="Looks built only from what you own.">
      <View style={styles.section}>
        <ThemedText type="smallBold" themeColor="textSecondary">
          What&apos;s the occasion?
        </ThemedText>
        <View style={styles.row}>
          {OCCASIONS.map((o) => (
            <Chip key={o} label={o} selected={occasion === o} onPress={() => setOccasion(o)} />
          ))}
        </View>
        <Field value={occasion} onChangeText={setOccasion} placeholder="Or describe it: rainy brunch, job interview…" />
        <Button
          label={suggestions.length ? 'Show me different looks' : 'Style me'}
          onPress={generate}
          loading={loading}
          disabled={items.length < 2}
        />
        {items.length < 2 && (
          <ThemedText type="small" themeColor="textSecondary">
            Add at least a top and a bottom to your closet first.
          </ThemedText>
        )}
        {error && (
          <ThemedText type="small" style={{ color: theme.danger }}>
            {error}
          </ThemedText>
        )}
      </View>

      {suggestions.map((outfit) => (
        <OutfitCard
          key={outfit.itemIds.join('|')}
          title={outfit.title}
          reasoning={outfit.reasoning}
          items={resolve(outfit.itemIds)}
          actionLabel="Save"
          onAction={() => save(outfit)}
        />
      ))}

      {saved.length > 0 && (
        <View style={styles.section}>
          <ThemedText type="smallBold" themeColor="textSecondary">
            Saved looks
          </ThemedText>
          {saved.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              title={`${outfit.title} · ${outfit.occasion}`}
              reasoning={outfit.reasoning}
              items={resolve(outfit.itemIds)}
              actionLabel="Remove"
              onAction={() => actions.removeOutfit(outfit.id)}
            />
          ))}
        </View>
      )}
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
});
