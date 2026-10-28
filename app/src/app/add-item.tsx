import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { emptyTags, TagEditor } from '@/components/tag-editor';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/controls';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { tagGarment } from '@/lib/api';
import { persistImage } from '@/lib/images';
import { actions, newId } from '@/lib/store';
import type { GarmentTags } from '@/lib/types';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [3, 4],
  // Small enough to keep uploads fast; plenty of detail for tagging.
  quality: 0.5,
  base64: true,
};

export default function AddItemScreen() {
  const theme = useTheme();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tags, setTags] = useState<GarmentTags>(emptyTags);
  const [tagging, setTagging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function choose(source: 'camera' | 'library') {
    if (source === 'camera') {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setMessage('Camera access is needed to take a photo.');
        return;
      }
    }
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync(PICKER_OPTIONS)
      : await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
    if (result.canceled) return;

    const asset = result.assets[0];
    setImageUri(asset.uri);
    setMessage(null);
    if (!asset.base64) return;

    setTagging(true);
    try {
      const { tags } = await tagGarment(asset.base64, asset.mimeType ?? 'image/jpeg');
      setTags(tags);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not auto-tag this photo.');
    } finally {
      setTagging(false);
    }
  }

  async function save() {
    if (!imageUri) return;
    setSaving(true);
    try {
      const id = newId();
      actions.addItem({
        ...tags,
        name: tags.name.trim() || `${tags.colors[0] ?? ''} ${tags.category}`.trim(),
        id,
        imageUri: await persistImage(imageUri, id),
        createdAt: Date.now(),
      });
      router.back();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save this item.');
      setSaving(false);
    }
  }

  return (
    <Screen title="New piece" subtitle="Photograph one item, laid flat or on a hanger." tabbed={false}>
      {imageUri ? (
        <Image source={imageUri} style={styles.preview} contentFit="cover" />
      ) : (
        <View style={[styles.preview, styles.placeholder, { backgroundColor: theme.backgroundElement }]}>
          <ThemedText themeColor="textSecondary">No photo yet</ThemedText>
        </View>
      )}

      <View style={styles.row}>
        {Platform.OS !== 'web' && <Button label="Take photo" variant="secondary" onPress={() => choose('camera')} />}
        <Button label="Choose photo" variant="secondary" onPress={() => choose('library')} />
      </View>

      {tagging && (
        <View style={styles.row}>
          <ActivityIndicator color={theme.accent} />
          <ThemedText type="small" themeColor="textSecondary">
            Reading the photo…
          </ThemedText>
        </View>
      )}
      {message && (
        <ThemedText type="small" style={{ color: theme.danger }}>
          {message}
        </ThemedText>
      )}

      {imageUri && !tagging && (
        <>
          <TagEditor value={tags} onChange={setTags} />
          <Button label="Save to closet" onPress={save} loading={saving} />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: '60%',
    alignSelf: 'center',
    aspectRatio: 3 / 4,
    borderRadius: Spacing.three,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
