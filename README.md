# Plot Twisted

A party game app that delivers interactive, story-driven challenges to groups of players. Pass the phone around as you navigate branching narratives filled with choices, dares, votes, and drinking challenges.

## Tech Stack

- **React Native** + **Expo** (SDK 55) — cross-platform mobile
- **TypeScript** — strict mode
- **Expo Router** — file-based routing
- **Zustand** — state management

## Getting Started

```bash
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

## Project Structure

```
app/                  # Screens (Expo Router file-based routing)
  game/               # In-game screens (story, dare, vote, drink)
components/           # Reusable UI components
engine/               # Game logic (story engine, interpolation, player rotation, content filter)
store/                # Zustand game state + selectors
types/                # TypeScript type definitions
data/
  stories/            # Story JSON files
  story-index.ts      # Story metadata registry
theme/                # Colors, spacing, typography
```

## How Stories Work

Stories are JSON files in `data/stories/` that define a directed graph of nodes. Each node has a type:

| Node Type     | Description                                      |
|---------------|--------------------------------------------------|
| `narrative`   | Story text that advances the plot                |
| `choice`      | Branch point where players pick an option        |
| `dare`        | Timed challenge for a targeted player            |
| `vote`        | All players vote, result determines the next node |
| `drink`       | Drinking challenge (with optional sober alternative) |
| `conclusion`  | End-of-story epilogue                            |

All text nodes support **spice levels** (`mild` / `wild`) for different content intensity. Player names are interpolated using template tokens like `{{current}}`, `{{next}}`, `{{random}}`, and `{{all}}`.

## Adding a New Story

1. Create a JSON file in `data/stories/` following the `Story` type in `types/story.ts`
2. Add metadata to `data/story-index.ts`
3. Import and register the story in `engine/storyEngine.ts`

## Game Settings

- **Spice Level** — `mild` or `wild` content variants
- **Sober Mode** — replaces drink nodes with alternative dares or narrative content
- **Player Count** — 5–10 players per game
