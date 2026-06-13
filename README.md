# 2048

A 2048 puzzle game built with [PixiJS 8](https://pixijs.com/) and TypeScript, using [Vite+](https://viteplus.dev/) as the toolchain and [Bun](https://bun.sh/) as the package manager.

## Getting Started

### Prerequisites

- [Vite+](https://viteplus.dev/guide/) (`vp` CLI): `curl -fsSL https://vite.plus | bash`
- [Bun](https://bun.sh/) (detected automatically by `vp` from the lockfile)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd 2048_game

# Install dependencies (also installs the pre-commit hook)
vp install
```

### Development

```bash
# Start the dev server on http://localhost:3212
vp dev

# Format, lint, and type-check (add --fix to autofix)
vp check

# Run tests (vp test watch for watch mode)
vp test

# Build for production / preview the build
vp build
vp preview
```

The same commands are available as `bun run dev`, `bun run check`, etc.

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
