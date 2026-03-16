import { View, Text, Switch, StyleSheet, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SpicePicker } from '../components/SpicePicker';
import { BigButton } from '../components/BigButton';
import { useGameStore } from '../store/gameStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function SettingsScreen() {
  const router = useRouter();
  const spiceLevel = useGameStore((s) => s.spiceLevel);
  const soberMode = useGameStore((s) => s.soberMode);
  const currentStoryId = useGameStore((s) => s.currentStoryId);
  const setSpiceLevel = useGameStore((s) => s.setSpiceLevel);
  const toggleSoberMode = useGameStore((s) => s.toggleSoberMode);
  const startGame = useGameStore((s) => s.startGame);

  const handleStart = () => {
    if (currentStoryId) {
      startGame(currentStoryId);
      router.push('/game/story');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Set the Vibe</Text>

        <Text style={styles.sectionLabel}>Spice Level</Text>
        <SpicePicker value={spiceLevel} onChange={setSpiceLevel} />

        <View style={styles.soberRow}>
          <View style={styles.soberText}>
            <Text style={styles.soberLabel}>Sober Mode</Text>
            <Text style={styles.soberDescription}>
              Replaces drink challenges with alternative dares
            </Text>
          </View>
          <Switch
            value={soberMode}
            onValueChange={toggleSoberMode}
            trackColor={{ false: colors.surfaceLight, true: colors.accent }}
            thumbColor={colors.textPrimary}
          />
        </View>
      </View>

      <View style={styles.bottom}>
        <BigButton title="Start Game" onPress={handleStart} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  } as TextStyle,
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 2,
  } as TextStyle,
  soberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  soberText: {
    flex: 1,
    marginRight: spacing.md,
  },
  soberLabel: {
    ...typography.buttonText,
    color: colors.textPrimary,
  } as TextStyle,
  soberDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  } as TextStyle,
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
});
