# 2048

A 2048 puzzle game built with [PixiJS 8](https://pixijs.com/) and TypeScript, using [Vite](https://vite.dev/) as the toolchain and [Bun](https://bun.sh/) as the package manager.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) — package manager and script runtime: `curl -fsSL https://bun.sh/install | bash`

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd 2048_game

# Install dependencies
bun install
```

### Development

```bash
# Start the dev server on http://localhost:3212
bun run dev

# Lint (oxlint) and type-check (tsc)
bun run lint
bun run typecheck

# Autofix lint + format (oxlint --fix + oxfmt)
bun run fix

# Run tests (bun run test:watch for watch mode)
bun run test

# Build for production / preview the build
bun run build
bun run preview
```

### Project Layout

- `src/engine/` — reusable game-engine layer over PixiJS (navigation, audio, resize, layout)
- `src/app/` — the 2048 game: screens, popups, UI widgets, game state
- `src/gen/` — generated asset manifest (do not edit)
- `raw-assets/` — source assets, processed by AssetPack into `public/assets/` during dev/build
- `scripts/` — AssetPack pipeline, Vite plugins, and git-hook tooling

See [AGENTS.md](AGENTS.md) for a more detailed architecture and tooling reference.

### Cleaning

```bash
# Clean all build artifacts and dependencies
bun run clean

# Clean only generated assets
bun run clean:assets
```

## License

Private project - All rights reserved
