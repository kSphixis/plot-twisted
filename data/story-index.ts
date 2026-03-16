import { StoryTheme } from '../types/story';

export interface StoryMeta {
  id: string;
  title: string;
  description: string;
  theme: StoryTheme;
  playerCount: { min: number; max: number };
  estimatedMinutes: number;
}

export const storyIndex: StoryMeta[] = [
  {
    id: 'haunted-house',
    title: 'The Haunted House',
    description: 'Your group dares to explore an abandoned mansion. What could go wrong?',
    theme: 'horror',
    playerCount: { min: 2, max: 10 },
    estimatedMinutes: 15,
  },
  {
    id: 'road-trip',
    title: 'Road Trip from Hell',
    description: 'A simple road trip spirals into chaos. Buckle up.',
    theme: 'comedy',
    playerCount: { min: 2, max: 8 },
    estimatedMinutes: 12,
  },
];
