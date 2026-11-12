import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Read the platform color scheme directly. React Native Web provides the
 * current scheme and subscribes to changes without a hydration state effect.
 */
export function useColorScheme() {
  return useRNColorScheme() ?? 'light';
}
