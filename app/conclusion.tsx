import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryText } from '../components/StoryText';
import { BigButton } from '../components/BigButton';
import { useGameStore } from '../store/gameStore';
import { loadStory, getNode, getNodeText } from '../engine/storyEngine';
import { interpolatePlayerNames } from '../engine/interpolation';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export default function ConclusionScreen() {
  const router = useRouter();
  const currentStoryId = useGameStore((s) => s.currentStoryId);
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const spiceLevel = useGameStore((s) => s.spiceLevel);
  const players = useGameStore((s) => s.players);
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const startGame = useGameStore((s) => s.startGame);
  const resetGame = useGameStore((s) => s.resetGame);

  let text = 'The story has ended.';
  if (currentStoryId && currentNodeId) {
    const story = loadStory(currentStoryId);
    const node = getNode(story, currentNodeId);
    const rawText = getNodeText(node, spiceLevel);
    text = interpolatePlayerNames(rawText, players, currentPlayerIndex);
  }

  const handlePlayAgain = () => {
    if (currentStoryId) {
      startGame(currentStoryId);
      router.replace('/game/story');
    }
  };

  const handleNewStory = () => {
    const savedPlayers = [...players];
    resetGame();
    useGameStore.getState().setPlayers(savedPlayers);
    router.replace('/story-selection');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>THE END</Text>

      <View style={styles.content}>
        <StoryText text={text} />
      </View>

      <View style={styles.buttons}>
        <BigButton
          title="Play Again"
          onPress={handlePlayAgain}
          color={colors.accent}
        />
        <BigButton
          title="New Story"
          onPress={handleNewStory}
          color={colors.surface}
          textColor={colors.accent}
          style={styles.secondaryButton}
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
  header: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.accent,
    textAlign: 'center',
    marginTop: spacing.xxl,
    letterSpacing: 8,
  } as TextStyle,
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttons: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
});
