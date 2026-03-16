import { SpiceContent, SpiceLevel, DrinkNode } from '../types/story';

export function getSpiceText(content: SpiceContent, level: SpiceLevel): string {
  return content[level];
}

export function applySoberMode(node: DrinkNode): {
  text: SpiceContent;
  type: 'dare' | 'narrative';
  dareDuration?: number;
} | null {
  if (!node.soberAlternative) return null;
  return node.soberAlternative;
}
