import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ItemGrid } from '@/components/garments';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button, Chip } from '@/components/ui/controls';
import { Spacing } from '@/constants/theme';
import { useStore } from '@/lib/store';
import { Categories, type Category } from '@/lib/types';

export default function ClosetScreen() {
  const items = useStore((s) => s.items);
  const [filter, setFilter] = useState<Category | null>(null);
  const visible = filter ? items.filter((i) => i.category === filter) : items;

  return (
    <Screen
      title="Closet"
      subtitle={`${items.length} ${items.length === 1 ? 'piece' : 'pieces'}`}
      action={<Button label="+ Add" onPress={() => router.push('/add-item')} />}>
      {items.length === 0 ? (
        <ThemedView type="backgroundElement" style={styles.empty}>
          <ThemedText type="smallBold">Start with five favorites</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Snap a photo of each piece. It gets tagged automatically, and once you have a few tops,
            bottoms and shoes you can start generating outfits.
          </ThemedText>
          <Button label="Add your first piece" onPress={() => router.push('/add-item')} />
        </ThemedView>
      ) : (
        <>
          <View style={styles.filters}>
            <Chip label="all" selected={filter === null} onPress={() => setFilter(null)} />
            {Categories.map((c) => (
              <Chip key={c} label={c} selected={filter === c} onPress={() => setFilter(c)} />
            ))}
          </View>
          {visible.length ? (
            <ItemGrid items={visible} />
          ) : (
            <ThemedText themeColor="textSecondary">Nothing in this category yet.</ThemedText>
          )}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    padding: Spacing.four,
    borderRadius: Spacing.three,
    gap: Spacing.three,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
});
