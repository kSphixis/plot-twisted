export function interpolatePlayerNames(
  text: string,
  players: string[],
  currentIndex: number
): string {
  return text
    .replace(/\{\{current\}\}/g, players[currentIndex] ?? 'Someone')
    .replace(/\{\{next\}\}/g, players[(currentIndex + 1) % players.length] ?? 'Someone')
    .replace(/\{\{random\}\}/g, players[Math.floor(Math.random() * players.length)] ?? 'Someone')
    .replace(/\{\{player:(\d+)\}\}/g, (_, idx) => {
      const i = parseInt(idx, 10) % players.length;
      return players[i] ?? 'Someone';
    })
    .replace(/\{\{all\}\}/g, formatAllPlayers(players));
}

function formatAllPlayers(players: string[]): string {
  if (players.length === 0) return 'everyone';
  if (players.length === 1) return players[0];
  if (players.length === 2) return `${players[0]} and ${players[1]}`;
  return `${players.slice(0, -1).join(', ')}, and ${players[players.length - 1]}`;
}
