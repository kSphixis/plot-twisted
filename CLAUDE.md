# CLAUDE.md

## Project Overview

Plot Twisted is a React Native party game built with Expo and TypeScript. Players pass a phone around and navigate branching story graphs with choices, dares, votes, and drinking challenges.

## Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in browser
```

No linter, formatter, or test runner is configured.

## Architecture

- **Expo Router** (`app/` directory) — file-based routing, Stack navigator
- **Zustand store** (`store/gameStore.ts`) — single store for all game state; selectors in `store/selectors.ts`
- **Story engine** (`engine/storyEngine.ts`) — loads story JSON, navigates the node graph
- **Content filter** (`engine/contentFilter.ts`) — resolves spice level (`mild`/`wild`) text
- **Interpolation** (`engine/interpolation.ts`) — replaces `{{current}}`, `{{next}}`, `{{random}}`, `{{all}}`, `{{player:N}}` with player names
- **Player rotation** (`engine/playerRotation.ts`) — manages turn order and player targeting

## Key Conventions

- TypeScript strict mode, no `any` unless casting story JSON imports
- Dark theme — background `#0D0D0D`, surface `#1A1A1A`, primary accent `#F5A623`
- Design tokens live in `theme/` (colors, spacing, typography)
- Stories are JSON files in `data/stories/` — schema defined by `types/story.ts`
- Node types: `narrative`, `choice`, `dare`, `vote`, `drink`, `conclusion`
- All user-facing text uses `SpiceContent` (`{ mild: string; wild: string }`)
- Adding a story requires: JSON file + entry in `data/story-index.ts` + import in `engine/storyEngine.ts`
- No automated tests currently exist
