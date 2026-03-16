import { SpiceLevel } from './story';

export type GamePhase = 'setup' | 'playing' | 'concluded';

export interface GameState {
  players: string[];
  currentPlayerIndex: number;
  spiceLevel: SpiceLevel;
  soberMode: boolean;
  currentStoryId: string | null;
  currentNodeId: string | null;
  visitedNodeIds: string[];
  voteResults: Record<string, Record<string, number>>;
  gamePhase: GamePhase;
}
