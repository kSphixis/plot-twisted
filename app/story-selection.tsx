import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storyIndex, StoryMeta } from '../data/story-index';
import { useGameStore } from '../store/gameStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

const themeEmoji: Record<string, string> = {
  horror: '👻',
  adventure: '🗺️',
  romance: '💕',
  mystery: '🔍',
  comedy: '😂',
};

export default function StorySelectionScreen() {
  const router = useRouter();
  const playerCount = useGameStore((s) => s.players.length);
  const setCurrentStoryId = useGameStore((s) => s.setCurrentStoryId);

  const selectStory = (story: StoryMeta) => {
    setCurrentStoryId(story.id);
    router.push('/settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose Your Fate</Text>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.list}
      >
        {storyIndex.map((story) => {
          const compatible =
            playerCount >= story.playerCount.min &&
            playerCount <= story.playerCount.max;

          return (
            <TouchableOpacity
              key={story.id}
              style={[styles.card, !compatible && styles.cardDimmed]}
              onPress={() => selectStory(story)}
              disabled={!compatible}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.emoji}>{themeEmoji[story.theme] ?? '📖'}</Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardTitle}>{story.title}</Text>
                  <Text style={styles.cardTime}>
                    ~{story.estimatedMinutes} min · {story.playerCount.min}-{story.playerCount.max} players
                  </Text>
                </View>
              </View>
              <Text style={styles.cardDescription}>{story.description}</Text>
              {!compatible && (
                <Text style={styles.incompatible}>
                  Needs {story.playerCount.min}-{story.playerCount.max} players
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    marginBottom: spacing.lg,
  } as TextStyle,
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardDimmed: {
    opacity: 0.4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  emoji: {
    fontSize: 36,
    marginRight: spacing.md,
  },
  cardMeta: {
    flex: 1,
  },
  cardTitle: {
    ...typography.buttonText,
    color: colors.textPrimary,
  } as TextStyle,
  cardTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  } as TextStyle,
  cardDescription: {
    ...typography.label,
    color: colors.textSecondary,
    lineHeight: 22,
  } as TextStyle,
  incompatible: {
    ...typography.caption,
    color: colors.danger,
    marginTop: spacing.sm,
  } as TextStyle,
});
