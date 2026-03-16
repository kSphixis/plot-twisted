import { useGameStore } from './gameStore';

export const useCurrentPlayer = () =>
  useGameStore((state) => state.players[state.currentPlayerIndex] ?? '');

export const useCurrentNode = () =>
  useGameStore((state) => state.currentNodeId);

export const useVoteTally = (nodeId: string) =>
  useGameStore((state) => state.voteResults[nodeId] ?? {});

export const usePlayerCount = () =>
  useGameStore((state) => state.players.length);

export const useIsPlaying = () =>
  useGameStore((state) => state.gamePhase === 'playing');
