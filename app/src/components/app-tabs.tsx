import { NativeTabs } from 'expo-router/native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Closet</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="hanger" md="checkroom" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="outfits">
        <NativeTabs.Trigger.Label>Outfits</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="sparkles" md="auto_awesome" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="bag" md="shopping_bag" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
