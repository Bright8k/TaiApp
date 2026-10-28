import { type ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  /** Tab screens reserve space for the tab bar; stack screens don't. */
  tabbed?: boolean;
};

export function Screen({ title, subtitle, action, children, tabbed = true }: Props) {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + (tabbed ? BottomTabInset : 0) + Spacing.three,
  };

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: tabbed ? insets.top : 0,
      paddingBottom: insets.bottom,
    },
    web: {
      paddingTop: Spacing.six + Spacing.four,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentInset={tabbed ? insets : { bottom: insets.bottom }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.content, contentPlatformStyle]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <ThemedText type="subtitle">{title}</ThemedText>
            {subtitle ? <ThemedText themeColor="textSecondary">{subtitle}</ThemedText> : null}
          </View>
          {action}
        </View>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.three,
  },
  headerText: {
    flexShrink: 1,
  },
});
