import { View, Text, StyleSheet, ScrollView, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryText } from '../../components/StoryText';
import { BigButton } from '../../components/BigButton';
import { useGameStore } from '../../store/gameStore';
import { useCurrentPlayer } from '../../store/selectors';
import { loadStory, getNode, getNodeText, getAvailableChoices } from '../../engine/storyEngine';
import { interpolatePlayerNames } from '../../engine/interpolation';
import { ChoiceNode } from '../../types/story';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export default function StoryScreen() {
  const router = useRouter();
  const currentStoryId = useGameStore((s) => s.currentStoryId);
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const spiceLevel = useGameStore((s) => s.spiceLevel);
  const players = useGameStore((s) => s.players);
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const advanceToNode = useGameStore((s) => s.advanceToNode);
  const rotatePlayer = useGameStore((s) => s.rotatePlayer);
  const setGamePhase = useGameStore((s) => s.setGamePhase);
  const currentPlayer = useCurrentPlayer();

  if (!currentStoryId || !currentNodeId) return null;

  const story = loadStory(currentStoryId);
  const node = getNode(story, currentNodeId);
  const rawText = getNodeText(node, spiceLevel);
  const text = interpolatePlayerNames(rawText, players, currentPlayerIndex);

  const navigateToNode = (nodeId: string) => {
    const nextNode = getNode(story, nodeId);
    advanceToNode(nodeId);
    rotatePlayer();

    switch (nextNode.type) {
      case 'dare':
        router.push('/game/dare');
        break;
      case 'vote':
        router.push('/game/vote');
        break;
      case 'drink':
        router.push('/game/drink');
        break;
      case 'conclusion':
        setGamePhase('concluded');
        router.replace('/conclusion');
        break;
      default:
        // narrative or choice — stay on this screen, re-render
        break;
    }
  };

  if (node.type === 'narrative') {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.turnIndicator}>{currentPlayer}'s turn</Text>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.textContainer}
        >
          <StoryText text={text} />
        </ScrollView>
        <View style={styles.bottom}>
          <BigButton
            title="Next"
            onPress={() => navigateToNode(node.nextNodeId)}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (node.type === 'choice') {
    const choices = getAvailableChoices(node as ChoiceNode, spiceLevel);
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.turnIndicator}>{currentPlayer}'s turn</Text>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.textContainer}
        >
          <StoryText text={text} />
        </ScrollView>
        <View style={styles.choiceContainer}>
          {choices.map((choice, idx) => (
            <BigButton
              key={idx}
              title={choice.label}
              onPress={() => navigateToNode(choice.nextNodeId)}
              color={colors.surface}
              textColor={colors.accent}
              style={styles.choiceButton}
            />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // For dare/vote/drink/conclusion nodes rendered directly (shouldn't happen normally)
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  turnIndicator: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 2,
  } as TextStyle,
  textContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    flexGrow: 1,
    justifyContent: 'center',
  },
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  choiceContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  choiceButton: {
    borderWidth: 2,
    borderColor: colors.accent,
    minWidth: undefined,
    width: '100%',
  },
});
