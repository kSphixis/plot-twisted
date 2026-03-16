import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BigButton } from '../components/BigButton';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>PLOT{'\n'}TWISTED</Text>
        <Text style={styles.subtitle}>A story you won't survive</Text>
      </View>
      <View style={styles.bottom}>
        <BigButton
          title="New Game"
          onPress={() => router.push('/player-setup')}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontSize: 64,
    fontWeight: '900',
    color: colors.accent,
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: 72,
  } as TextStyle,
  subtitle: {
    ...typography.label,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 4,
  } as TextStyle,
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
});
