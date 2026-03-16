import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextStyle, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StoryText } from '../../components/StoryText';
import { BigButton } from '../../components/BigButton';
import { useGameStore } from '../../store/gameStore';
import { loadStory, getNode, getNodeText } from '../../engine/storyEngine';
import { interpolatePlayerNames } from '../../engine/interpolation';
import { VoteNode } from '../../types/story';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import * as Haptics from 'expo-haptics';

export default function VoteScreen() {
  const router = useRouter();
  const currentStoryId = useGameStore((s) => s.currentStoryId);
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const spiceLevel = useGameStore((s) => s.spiceLevel);
  const players = useGameStore((s) => s.players);
  const currentPlayerIndex = useGameStore((s) => s.currentPlayerIndex);
  const setVoteCounts = useGameStore((s) => s.setVoteCounts);
  const resolveVote = useGameStore((s) => s.resolveVote);
  const advanceToNode = useGameStore((s) => s.advanceToNode);
  const rotatePlayer = useGameStore((s) => s.rotatePlayer);
  const setGamePhase = useGameStore((s) => s.setGamePhase);

  const [showResults, setShowResults] = useState(false);
  const [tallies, setTallies] = useState<Record<string, number>>({});

  if (!currentStoryId || !currentNodeId) return null;

  const story = loadStory(currentStoryId);
  const rawNode = getNode(story, currentNodeId);

  if (rawNode.type !== 'vote') {
    return null;
  }

  const node = rawNode as VoteNode;
  const rawText = getNodeText(node, spiceLevel);
  const text = interpolatePlayerNames(rawText, players, currentPlayerIndex);

  const totalVotes = Object.values(tallies).reduce((sum, n) => sum + n, 0);

  const increment = (label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTallies((prev) => ({ ...prev, [label]: (prev[label] || 0) + 1 }));
  };

  const decrement = (label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTallies((prev) => ({
      ...prev,
      [label]: Math.max((prev[label] || 0) - 1, 0),
    }));
  };

  const handleSeeResults = () => {
    setVoteCounts(currentNodeId, tallies);
    setShowResults(true);
  };

  const handleContinue = () => {
    const winningLabel = resolveVote(currentNodeId);
    if (!winningLabel) return;

    const winningOption = node.options.find((o) => o.label === winningLabel);
    if (!winningOption) return;

    const nextNode = getNode(story, winningOption.nextNodeId);
    advanceToNode(winningOption.nextNodeId);
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

  if (showResults) {
    const maxVotes = Math.max(...Object.values(tallies));
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>RESULTS</Text>
        <View style={styles.results}>
          {node.options.map((option) => {
            const count = tallies[option.label] || 0;
            const isWinner = count === maxVotes;
            return (
              <View key={option.label} style={styles.resultRow}>
                <Text
                  style={[
                    styles.resultLabel,
                    isWinner && { color: colors.voteColor },
                  ]}
                >
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.resultCount,
                    isWinner && { color: colors.voteColor },
                  ]}
                >
                  {count} vote{count !== 1 ? 's' : ''}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.bottom}>
          <BigButton
            title="Continue"
            onPress={handleContinue}
            color={colors.voteColor}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>VOTE</Text>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
      >
        <StoryText text={text} color={colors.voteColor} />

        <View style={styles.options}>
          {node.options.map((option) => {
            const count = tallies[option.label] || 0;
            return (
              <View key={option.label} style={styles.tallyRow}>
                <Text style={styles.tallyLabel}>{option.label}</Text>
                <View style={styles.counter}>
                  <TouchableOpacity
                    style={[styles.counterBtn, count === 0 && styles.counterBtnDisabled]}
                    onPress={() => decrement(option.label)}
                    disabled={count === 0}
                  >
                    <Text style={[styles.counterBtnText, count === 0 && styles.counterBtnTextDisabled]}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.counterValue}>{count}</Text>
                  <TouchableOpacity
                    style={styles.counterBtn}
                    onPress={() => increment(option.label)}
                  >
                    <Text style={styles.counterBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <BigButton
          title="See Results"
          onPress={handleSeeResults}
          color={colors.voteColor}
          disabled={totalVotes === 0}
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
  flex: {
    flex: 1,
  },
  header: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.voteColor,
    textAlign: 'center',
    marginTop: spacing.lg,
    letterSpacing: 6,
  } as TextStyle,
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  options: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  tallyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    minHeight: 56,
  },
  tallyLabel: {
    ...typography.buttonText,
    color: colors.textPrimary,
    flex: 1,
  } as TextStyle,
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  counterBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.voteColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterBtnDisabled: {
    borderColor: colors.border,
  },
  counterBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.voteColor,
    lineHeight: 24,
  } as TextStyle,
  counterBtnTextDisabled: {
    color: colors.border,
  } as TextStyle,
  counterValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 28,
    textAlign: 'center',
  } as TextStyle,
  results: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
  },
  resultLabel: {
    ...typography.buttonText,
    color: colors.textPrimary,
  } as TextStyle,
  resultCount: {
    ...typography.label,
    color: colors.textSecondary,
  } as TextStyle,
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
});
