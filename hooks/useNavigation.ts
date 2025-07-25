import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export const useAppNavigation = () => {
  const router = useRouter();

  const navigateWithHaptic = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  const navigateToTab = (tab: 'dashboard' | 'journal' | 'scanner' | 'ai' | 'profile') => {
    navigateWithHaptic(`/(tabs)/${tab}`);
  };

  const navigateToScanner = (mode?: 'barcode' | 'food' | 'manual') => {
    if (mode) {
      navigateWithHaptic(`/(tabs)/scanner?mode=${mode}`);
    } else {
      navigateWithHaptic('/(tabs)/scanner');
    }
  };

  const navigateToAI = (tab?: 'chat' | 'planner' | 'insights') => {
    if (tab) {
      navigateWithHaptic(`/(tabs)/ai?tab=${tab}`);
    } else {
      navigateWithHaptic('/(tabs)/ai');
    }
  };

  const navigateToJournal = (filter?: string) => {
    if (filter) {
      navigateWithHaptic(`/(tabs)/journal?filter=${filter}`);
    } else {
      navigateWithHaptic('/(tabs)/journal');
    }
  };

  const navigateToProfile = (section?: string) => {
    if (section) {
      navigateWithHaptic(`/(tabs)/profile?section=${section}`);
    } else {
      navigateWithHaptic('/(tabs)/profile');
    }
  };

  return {
    navigateWithHaptic,
    navigateToTab,
    navigateToScanner,
    navigateToAI,
    navigateToJournal,
    navigateToProfile,
  };
};