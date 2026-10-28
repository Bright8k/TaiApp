import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Chip, Field } from '@/components/ui/controls';
import { Spacing } from '@/constants/theme';
import { Categories, Seasons, Styles, type GarmentTags } from '@/lib/types';

const FORMALITY_LABELS = ['Lounge', 'Casual', 'Smart', 'Dressy', 'Formal'];

export const emptyTags: GarmentTags = {
  name: '',
  category: 'top',
  colors: [],
  pattern: 'solid',
  styles: [],
  seasons: [],
  formality: 2,
};

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

export function TagEditor({ value, onChange }: { value: GarmentTags; onChange: (tags: GarmentTags) => void }) {
  const set = (patch: Partial<GarmentTags>) => onChange({ ...value, ...patch });

  return (
    <View style={styles.form}>
      <Section label="Name">
        <Field value={value.name} onChangeText={(name) => set({ name })} placeholder="e.g. Cream cable-knit sweater" />
      </Section>

      <Section label="Category">
        {Categories.map((c) => (
          <Chip key={c} label={c} selected={value.category === c} onPress={() => set({ category: c })} />
        ))}
      </Section>

      <Section label="Colors (dominant first)">
        <Field
          value={value.colors.join(', ')}
          onChangeText={(text) => set({ colors: text.split(',').map((c) => c.trim().toLowerCase()).filter(Boolean) })}
          placeholder="navy, white"
          autoCapitalize="none"
          style={styles.fullWidth}
        />
      </Section>

      <Section label="Pattern">
        <Field
          value={value.pattern}
          onChangeText={(pattern) => set({ pattern: pattern.toLowerCase() })}
          placeholder="solid"
          autoCapitalize="none"
          style={styles.fullWidth}
        />
      </Section>

      <Section label="Style">
        {Styles.map((s) => (
          <Chip key={s} label={s} selected={value.styles.includes(s)} onPress={() => set({ styles: toggle(value.styles, s) })} />
        ))}
      </Section>

      <Section label="Seasons">
        {Seasons.map((s) => (
          <Chip key={s} label={s} selected={value.seasons.includes(s)} onPress={() => set({ seasons: toggle(value.seasons, s) })} />
        ))}
      </Section>

      <Section label="Formality">
        {FORMALITY_LABELS.map((label, index) => (
          <Chip key={label} label={label} selected={value.formality === index + 1} onPress={() => set({ formality: index + 1 })} />
        ))}
      </Section>
    </View>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <ThemedText type="smallBold" themeColor="textSecondary">
        {label}
      </ThemedText>
      <View style={styles.row}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.four,
  },
  section: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  fullWidth: {
    flexGrow: 1,
  },
});
