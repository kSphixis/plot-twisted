import { Story, StoryNode, ChoiceNode, SpiceLevel, Choice } from '../types/story';
import { getSpiceText } from './contentFilter';

// Story registry — import JSON files here
import hauntedHouse from '../data/stories/haunted-house.json';
import roadTrip from '../data/stories/road-trip.json';

const storyRegistry: Record<string, Story> = {
  'haunted-house': hauntedHouse as unknown as Story,
  'road-trip': roadTrip as unknown as Story,
};

export function loadStory(storyId: string): Story {
  const story = storyRegistry[storyId];
  if (!story) {
    throw new Error(`Story not found: ${storyId}`);
  }
  return story;
}

export function getNode(story: Story, nodeId: string): StoryNode {
  const node = story.nodes[nodeId];
  if (!node) {
    throw new Error(`Node not found: ${nodeId} in story ${story.id}`);
  }
  return node;
}

export function getNodeText(
  node: StoryNode,
  spiceLevel: SpiceLevel
): string {
  return getSpiceText(node.text, spiceLevel);
}

const spiceLevelOrder: SpiceLevel[] = ['mild', 'wild'];

export function getAvailableChoices(
  node: ChoiceNode,
  spiceLevel: SpiceLevel
): Choice[] {
  const currentLevelIndex = spiceLevelOrder.indexOf(spiceLevel);
  return node.choices.filter((choice) => {
    if (!choice.minSpiceLevel) return true;
    return spiceLevelOrder.indexOf(choice.minSpiceLevel) <= currentLevelIndex;
  });
}

export function getNextNodeId(node: StoryNode, choiceIndex?: number): string | null {
  switch (node.type) {
    case 'narrative':
    case 'drink':
    case 'dare':
      return node.nextNodeId;
    case 'choice': {
      const choice = node.choices[choiceIndex ?? 0];
      return choice?.nextNodeId ?? null;
    }
    case 'vote':
      // Vote resolution happens externally via the store
      return null;
    case 'conclusion':
      return null;
  }
}
