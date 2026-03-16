import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryText } from '../../components/StoryText';
import { BigButton } from '../../components/BigButton';
import { useGameStore } from '../../store/gameStore';
import { loadStory, getNode, getNodeText } from '../../engine/storyEngine';
import { interpolatePlayerNames } from '../../engine/interpolation';
import { resolvePlayerTarget } from '../../engine/playerRotation';
import { applySoberMode, getSpiceText } from '../../engine/contentFilter';
import { DrinkNode } from '../../types/story';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export default function DrinkScreen() {
  const router = useRouter();
  const currentStoryId = useGameStore((s) => s.currentStoryId);
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const spiceLevel = useGameStore((s) => s.spiceLevel);
  const soberMode = useGameStore((s) => s.soberMode);
  const players = useGameStore((s) => s.players);
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const advanceToNode = useGameStore((s) => s.advanceToNode);
  const rotatePlayer = useGameStore((s) => s.rotatePlayer);
  const setGamePhase = useGameStore((s) => s.setGamePhase);

  if (!currentStoryId || !currentNodeId) return null;

  const story = loadStory(currentStoryId);
  const node = getNode(story, currentNodeId) as DrinkNode;
  const targetPlayer = resolvePlayerTarget(node.targetPlayer, players, currentPlayerIndex);

  // Handle sober mode
  const soberAlt = soberMode ? applySoberMode(node) : null;
  let displayText: string;
  let headerText: string;
  let headerColor: string;

  if (soberMode && soberAlt) {
    const rawText = getSpiceText(soberAlt.text, spiceLevel);
    displayText = interpolatePlayerNames(rawText, players, currentPlayerIndex);
    headerText = soberAlt.type === 'dare' ? 'CHALLENGE' : 'CHALLENGE';
    headerColor = colors.dareColor;
  } else if (soberMode) {
    // No sober alternative — skip
    displayText = `${targetPlayer} is safe this round!`;
    headerText = 'SKIP';
    headerColor = colors.textSecondary;
  } else {
    const rawText = getNodeText(node, spiceLevel);
    displayText = interpolatePlayerNames(rawText, players, currentPlayerIndex);
    headerText = 'DRINK';
    headerColor = colors.drinkColor;
  }

  const handleNext = () => {
    const nextNode = getNode(story, node.nextNodeId);
    advanceToNode(node.nextNodeId);
    rotatePlayer();

    switch (nextNode.type) {
      case 'conclusion':
        setGamePhase('concluded');
        router.replace('/conclusion');
        break;
      case 'dare':
        router.replace('/game/dare');
        break;
      case 'vote':
        router.replace('/game/vote');
        break;
      case 'drink':
        router.replace('/game/drink');
        break;
      default:
        router.replace('/game/story');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.header, { color: headerColor }]}>{headerText}</Text>
      <Text style={styles.target}>{targetPlayer}</Text>

      <View style={styles.content}>
        <StoryText text={displayText} color={headerColor} />
      </View>

      <View style={styles.bottom}>
        <BigButton
          title="Done"
          onPress={handleNext}
          color={headerColor}
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
    textAlign: 'center',
    marginTop: spacing.lg,
    letterSpacing: 6,
  } as TextStyle,
  target: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.sm,
  } as TextStyle,
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
});
