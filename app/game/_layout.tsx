import { Stack } from 'expo-router';
import { colors } from '../../theme/colors';

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        gestureEnabled: false,
        animation: 'fade',
      }}
    />
  );
}
