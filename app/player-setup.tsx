import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextStyle,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlayerNameInput } from '../components/PlayerNameInput';
import { BigButton } from '../components/BigButton';
import { useGameStore } from '../store/gameStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const MIN_PLAYERS = 5;
const MAX_PLAYERS = 10;

export default function PlayerSetupScreen() {
  const router = useRouter();
  const setPlayers = useGameStore((s) => s.setPlayers);
  const [names, setNames] = useState<string[]>(['', '', '', '', '']);

  const updateName = (index: number, text: string) => {
    const updated = [...names];
    updated[index] = text;
    setNames(updated);
  };

  const removeName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const addName = () => {
    if (names.length < MAX_PLAYERS) {
      setNames([...names, '']);
    }
  };

  const validNames = names.filter((n) => n.trim().length > 0);
  const canContinue = validNames.length >= MIN_PLAYERS;

  const handleContinue = () => {
    setPlayers(validNames);
    router.push('/story-selection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Who's Playing?</Text>
        <Text style={styles.count}>
          {validNames.length} of {MIN_PLAYERS}-{MAX_PLAYERS} players
        </Text>

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
        >
          {names.map((name, index) => (
            <PlayerNameInput
              key={index}
              value={name}
              index={index}
              onChangeText={(text) => updateName(index, text)}
              onRemove={() => removeName(index)}
              canRemove={names.length > MIN_PLAYERS}
            />
          ))}

          {names.length < MAX_PLAYERS && (
            <BigButton
              title="+ Add Player"
              onPress={addName}
              color={colors.surface}
              textColor={colors.accent}
              style={styles.addButton}
            />
          )}
        </ScrollView>

        <View style={styles.bottom}>
          <BigButton
            title="Continue"
            onPress={handleContinue}
            disabled={!canContinue}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  title: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.lg,
  } as TextStyle,
  count: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  } as TextStyle,
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  addButton: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    minWidth: undefined,
  },
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
});
