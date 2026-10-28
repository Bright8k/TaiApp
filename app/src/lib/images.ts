import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

/**
 * Copies a picked photo into the app's document directory so it survives cache clears.
 * On web there is no persistent filesystem, so the picker's data URI is kept as-is.
 */
export async function persistImage(uri: string, id: string): Promise<string> {
  if (Platform.OS === 'web') return uri;

  const dir = new Directory(Paths.document, 'closet');
  dir.create({ idempotent: true, intermediates: true });
  const extension = uri.split('.').pop()?.split('?')[0] || 'jpg';
  const destination = new File(dir, `${id}.${extension}`);
  await new File(uri).copy(destination);
  return destination.uri;
}

export function deleteImage(uri: string) {
  if (Platform.OS === 'web') return;
  try {
    new File(uri).delete();
  } catch {
    // Already gone; nothing to clean up.
  }
}
