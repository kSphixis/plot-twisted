import { PlayerTarget } from '../types/story';

export function shufflePlayers(players: string[]): string[] {
  const arr = [...players];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function getNextPlayerIndex(
  currentIndex: number,
  playerCount: number
): number {
  return (currentIndex + 1) % playerCount;
}

export function resolvePlayerTarget(
  target: PlayerTarget,
  players: string[],
  currentIndex: number
): string {
  switch (target.type) {
    case 'current':
      return players[currentIndex];
    case 'next':
      return players[(currentIndex + 1) % players.length];
    case 'random': {
      const idx = Math.floor(Math.random() * players.length);
      return players[idx];
    }
    case 'specific':
      return players[target.index % players.length];
  }
}
