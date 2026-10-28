import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { TagEditor } from '@/components/tag-editor';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/controls';
import { Spacing } from '@/constants/theme';
import { deleteImage } from '@/lib/images';
import { actions, useStore } from '@/lib/store';
import type { ClosetItem, GarmentTags } from '@/lib/types';

export default function ItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const items = useStore((s) => s.items);
  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <Screen title="Not found" tabbed={false}>
        <ThemedText themeColor="textSecondary">This item was removed from your closet.</ThemedText>
      </Screen>
    );
  }
  return <ItemEditor item={item} />;
}

function ItemEditor({ item }: { item: ClosetItem }) {
  const [tags, setTags] = useState<GarmentTags>(item);

  function remove() {
    const confirmDelete = () => {
      actions.removeItem(item.id);
      deleteImage(item.imageUri);
      router.back();
    };
    if (Platform.OS === 'web') {
      confirmDelete();
      return;
    }
    Alert.alert('Remove this piece?', 'Saved outfits that use it will be removed too.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: confirmDelete },
    ]);
  }

  return (
    <Screen title={item.name} tabbed={false}>
      <Image source={item.imageUri} style={styles.image} contentFit="cover" />
      <TagEditor value={tags} onChange={setTags} />
      <View style={styles.actions}>
        <Button
          label="Save changes"
          onPress={() => {
            actions.updateItem(item.id, tags);
            router.back();
          }}
        />
        <Button label="Remove" variant="danger" onPress={remove} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '60%',
    alignSelf: 'center',
    aspectRatio: 3 / 4,
    borderRadius: Spacing.three,
  },
  actions: {
    gap: Spacing.two,
  },
});
