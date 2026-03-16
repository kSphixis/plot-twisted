import { create } from 'zustand';
import { SpiceLevel } from '../types/story';
import { GamePhase, GameState } from '../types/game';
import { shufflePlayers } from '../engine/playerRotation';
import { loadStory } from '../engine/storyEngine';

interface GameActions {
  addPlayer: (name: string) => void;
  removePlayer: (index: number) => void;
  setPlayers: (names: string[]) => void;
  setSpiceLevel: (level: SpiceLevel) => void;
  toggleSoberMode: () => void;
  setCurrentStoryId: (id: string) => void;
  startGame: (storyId: string) => void;
  advanceToNode: (nodeId: string) => void;
  rotatePlayer: () => void;
  castVote: (nodeId: string, option: string) => void;
  setVoteCounts: (nodeId: string, counts: Record<string, number>) => void;
  resolveVote: (nodeId: string) => string | null;
  resetGame: () => void;
  setGamePhase: (phase: GamePhase) => void;
}

const initialState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  spiceLevel: 'mild',
  soberMode: false,
  currentStoryId: null,
  currentNodeId: null,
  visitedNodeIds: [],
  voteResults: {},
  gamePhase: 'setup',
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  addPlayer: (name: string) => {
    const { players } = get();
    if (players.length < 10 && name.trim()) {
      set({ players: [...players, name.trim()] });
    }
  },

  removePlayer: (index: number) => {
    const { players } = get();
    set({ players: players.filter((_, i) => i !== index) });
  },

  setPlayers: (names: string[]) => {
    set({ players: names });
  },

  setSpiceLevel: (level: SpiceLevel) => {
    set({ spiceLevel: level });
  },

  toggleSoberMode: () => {
    set((state) => ({ soberMode: !state.soberMode }));
  },

  setCurrentStoryId: (id: string) => {
    set({ currentStoryId: id });
  },

  startGame: (storyId: string) => {
    const { players } = get();
    const story = loadStory(storyId);
    set({
      currentStoryId: storyId,
      currentNodeId: story.entryNodeId,
      currentPlayerIndex: 0,
      players: shufflePlayers([...players]),
      visitedNodeIds: [story.entryNodeId],
      voteResults: {},
      gamePhase: 'playing',
    });
  },

  advanceToNode: (nodeId: string) => {
    set((state) => ({
      currentNodeId: nodeId,
      visitedNodeIds: [...state.visitedNodeIds, nodeId],
    }));
  },

  rotatePlayer: () => {
    set((state) => ({
      currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
    }));
  },

  castVote: (nodeId: string, option: string) => {
    set((state) => {
      const nodeVotes = state.voteResults[nodeId] || {};
      return {
        voteResults: {
          ...state.voteResults,
          [nodeId]: {
            ...nodeVotes,
            [option]: (nodeVotes[option] || 0) + 1,
          },
        },
      };
    });
  },

  setVoteCounts: (nodeId: string, counts: Record<string, number>) => {
    set((state) => ({
      voteResults: { ...state.voteResults, [nodeId]: counts },
    }));
  },

  resolveVote: (nodeId: string) => {
    const { voteResults } = get();
    const nodeVotes = voteResults[nodeId];
    if (!nodeVotes) return null;

    const entries = Object.entries(nodeVotes);
    if (entries.length === 0) return null;

    const maxVotes = Math.max(...entries.map(([, count]) => count));
    const winners = entries.filter(([, count]) => count === maxVotes);

    // Random tiebreaker
    const winner = winners[Math.floor(Math.random() * winners.length)];
    return winner[0];
  },

  resetGame: () => {
    set(initialState);
  },

  setGamePhase: (phase: GamePhase) => {
    set({ gamePhase: phase });
  },
}));
