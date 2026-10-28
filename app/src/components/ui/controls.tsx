import { ActivityIndicator, Pressable, StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: selected ? theme.accent : theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <ThemedText type="small" style={{ color: selected ? theme.onAccent : theme.text }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
};

export function Button({ label, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
  const theme = useTheme();
  const background = variant === 'primary' ? theme.accent : theme.backgroundElement;
  const color = variant === 'primary' ? theme.onAccent : variant === 'danger' ? theme.danger : theme.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background },
        (pressed || disabled) && styles.pressed,
      ]}>
      {loading ? <ActivityIndicator color={color} /> : null}
      <ThemedText type="smallBold" style={{ color }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export function Field(props: TextInputProps) {
  const theme = useTheme();
  return (
    <TextInput
      placeholderTextColor={theme.textSecondary}
      {...props}
      style={[styles.field, { backgroundColor: theme.backgroundElement, color: theme.text }, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: Spacing.one + Spacing.half,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.four,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.four,
  },
  field: {
    paddingVertical: Spacing.two + Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
    fontSize: 16,
  },
  pressed: {
    opacity: 0.6,
  },
});
