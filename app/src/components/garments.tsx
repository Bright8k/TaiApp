import { Image } from 'expo-image';
import { Link, type Href } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Chip } from '@/components/ui/controls';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { ClosetItem, Recommendation } from '@/lib/types';

export function ItemGrid({ items }: { items: ClosetItem[] }) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <Link key={item.id} href={{ pathname: '/item/[id]', params: { id: item.id } }} asChild>
          <Pressable style={({ pressed }) => [styles.gridCell, pressed && styles.pressed]}>
            <Image source={item.imageUri} style={styles.gridImage} contentFit="cover" transition={150} />
            <ThemedText type="small" numberOfLines={1}>
              {item.name || item.category}
            </ThemedText>
          </Pressable>
        </Link>
      ))}
    </View>
  );
}

type OutfitCardProps = {
  title: string;
  reasoning: string;
  items: ClosetItem[];
  actionLabel: string;
  onAction: () => void;
};

export function OutfitCard({ title, reasoning, items, actionLabel, onAction }: OutfitCardProps) {
  const theme = useTheme();
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.cardHeader}>
        <ThemedText type="smallBold" style={styles.flex}>
          {title}
        </ThemedText>
        <Pressable onPress={onAction} hitSlop={8}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            {actionLabel}
          </ThemedText>
        </Pressable>
      </View>
      <View style={styles.outfitRow}>
        {items.map((item) => (
          <Image key={item.id} source={item.imageUri} style={styles.outfitImage} contentFit="cover" />
        ))}
      </View>
      <ThemedText type="small" themeColor="textSecondary">
        {reasoning}
      </ThemedText>
    </ThemedView>
  );
}

type ProductCardProps = {
  recommendation: Recommendation;
  closet: ClosetItem[];
  rating: 'like' | 'dislike' | null;
  onRate: (rating: 'like' | 'dislike' | null) => void;
};

export function ProductCard({ recommendation, closet, rating, onRate }: ProductCardProps) {
  const { product, reason, pairsWith } = recommendation;
  const theme = useTheme();
  const pairs = closet.filter((item) => pairsWith.includes(item.id));

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      <View style={styles.productRow}>
        <View style={[styles.swatch, { backgroundColor: product.swatch }]} />
        <View style={styles.flex}>
          <ThemedText type="smallBold">{product.name}</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {product.brand} · ${product.price}
          </ThemedText>
          <ThemedText type="small">{reason}</ThemedText>
        </View>
      </View>
      {pairs.length > 0 && (
        <View style={styles.pairsRow}>
          <ThemedText type="small" themeColor="textSecondary">
            Wear with
          </ThemedText>
          {pairs.map((item) => (
            <Image key={item.id} source={item.imageUri} style={styles.pairImage} contentFit="cover" />
          ))}
        </View>
      )}
      <View style={styles.actionsRow}>
        <Chip label="♥ Love it" selected={rating === 'like'} onPress={() => onRate(rating === 'like' ? null : 'like')} />
        <Chip label="Not me" selected={rating === 'dislike'} onPress={() => onRate(rating === 'dislike' ? null : 'dislike')} />
        <ExternalLink href={product.url as Href & string} style={styles.shopLink}>
          <ThemedText type="smallBold" style={{ color: theme.accent }}>
            Shop ↗
          </ThemedText>
        </ExternalLink>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  gridCell: {
    width: '30%',
    flexGrow: 1,
    maxWidth: '32%',
    gap: Spacing.one,
  },
  gridImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: Spacing.three,
  },
  pressed: {
    opacity: 0.7,
  },
  card: {
    padding: Spacing.three,
    borderRadius: Spacing.three,
    gap: Spacing.two,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  flex: {
    flex: 1,
    gap: Spacing.half,
  },
  outfitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  outfitImage: {
    width: 72,
    height: 96,
    borderRadius: Spacing.two,
  },
  productRow: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  swatch: {
    width: 72,
    height: 96,
    borderRadius: Spacing.two,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#8884',
  },
  pairsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pairImage: {
    width: 36,
    height: 48,
    borderRadius: Spacing.one,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  shopLink: {
    marginLeft: 'auto',
  },
});
