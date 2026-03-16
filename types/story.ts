export type SpiceLevel = 'mild' | 'wild';

export type StoryTheme = 'horror' | 'adventure' | 'romance' | 'mystery' | 'comedy';

export interface SpiceContent {
  mild: string;
  wild: string;
}

export type PlayerTarget =
  | { type: 'current' }
  | { type: 'random' }
  | { type: 'next' }
  | { type: 'specific'; index: number };

export interface BaseNode {
  id: string;
  type: string;
}

export interface NarrativeNode extends BaseNode {
  type: 'narrative';
  text: SpiceContent;
  nextNodeId: string;
}

export interface Choice {
  label: string;
  nextNodeId: string;
  minSpiceLevel?: SpiceLevel;
}

export interface ChoiceNode extends BaseNode {
  type: 'choice';
  text: SpiceContent;
  choices: Choice[];
}

export interface DrinkNode extends BaseNode {
  type: 'drink';
  text: SpiceContent;
  targetPlayer: PlayerTarget;
  soberAlternative?: {
    text: SpiceContent;
    type: 'dare' | 'narrative';
    dareDuration?: number;
  };
  nextNodeId: string;
}

export interface DareNode extends BaseNode {
  type: 'dare';
  text: SpiceContent;
  targetPlayer: PlayerTarget;
  durationSeconds: number;
  nextNodeId: string;
}

export interface VoteOption {
  label: string;
  nextNodeId: string;
}

export interface VoteNode extends BaseNode {
  type: 'vote';
  text: SpiceContent;
  options: VoteOption[];
}

export interface ConclusionNode extends BaseNode {
  type: 'conclusion';
  text: SpiceContent;
}

export type StoryNode =
  | NarrativeNode
  | ChoiceNode
  | DrinkNode
  | DareNode
  | VoteNode
  | ConclusionNode;

export interface Story {
  id: string;
  title: string;
  description: string;
  theme: StoryTheme;
  playerCount: { min: number; max: number };
  estimatedMinutes: number;
  nodes: Record<string, StoryNode>;
  entryNodeId: string;
}
