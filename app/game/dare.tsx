import { useState } from 'react';
import { View, Text, StyleSheet, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryText } from '../../components/StoryText';
import { CountdownTimer } from '../../components/CountdownTimer';
import { BigButton } from '../../components/BigButton';
import { useGameStore } from '../../store/gameStore';
import { loadStory, getNode, getNodeText } from '../../engine/storyEngine';
import { interpolatePlayerNames } from '../../engine/interpolation';
import { resolvePlayerTarget } from '../../engine/playerRotation';
import { DareNode } from '../../types/story';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export default function DareScreen() {
  const router = useRouter();
  const [timerDone, setTimerDone] = useState(false);

  const currentStoryId = useGameStore((s) => s.currentStoryId);
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const spiceLevel = useGameStore((s) => s.spiceLevel);
  const players = useGameStore((s) => s.players);
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const advanceToNode = useGameStore((s) => s.advanceToNode);
  const rotatePlayer = useGameStore((s) => s.rotatePlayer);
  const setGamePhase = useGameStore((s) => s.setGamePhase);

  if (!currentStoryId || !currentNodeId) return null;

  const story = loadStory(currentStoryId);
  const rawNode = getNode(story, currentNodeId);

  if (rawNode.type !== 'dare') {
    return null;
  }

  const node = rawNode as DareNode;
  const rawText = getNodeText(node, spiceLevel);
  const text = interpolatePlayerNames(rawText, players, currentPlayerIndex);
  const targetPlayer = resolvePlayerTarget(node.targetPlayer, players, currentPlayerIndex);

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
      <Text style={styles.header}>DARE</Text>
      <Text style={styles.target}>{targetPlayer}</Text>

      <View style={styles.content}>
        <StoryText text={text} color={colors.dareColor} />
      </View>

      {!timerDone ? (
        <CountdownTimer
          durationSeconds={node.durationSeconds}
          onComplete={() => setTimerDone(true)}
          color={colors.dareColor}
        />
      ) : (
        <View style={styles.bottom}>
          <BigButton
            title="Done"
            onPress={handleNext}
            color={colors.dareColor}
          />
        </View>
      )}

      {!timerDone && (
        <View style={styles.skipContainer}>
          <BigButton
            title="Skip"
            onPress={handleNext}
            color="transparent"
            textColor={colors.textSecondary}
            style={styles.skipButton}
          />
        </View>
      )}
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
    color: colors.dareColor,
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
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  skipContainer: {
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  skipButton: {
    minWidth: 100,
    minHeight: 40,
  },
});
