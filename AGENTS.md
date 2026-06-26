# 2048 Game

A 2048 puzzle game built with PixiJS 8 and TypeScript
Bun is the package manager and script runtime
Vite is the bundler/dev server
oxlint + oxfmt for lint/format and Vitest for tests

## Documentation

- [docs/architecture.md](docs/architecture.md) — layered diagram + the engine↔game boundary
- [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) — the documentation standard (how this repo is documented)
- [docs/decisions/](docs/decisions/) — ADRs (the _why_ behind key choices)
- [llms.txt](llms.txt) — curated index for LLM agents

## Review Checklist

- [ ] Run `bun install` after pulling remote changes and before getting started.
- [ ] **Fresh clone only:** run `bun run dev` (or `bun run build`) once before `bun run lint` — AssetPack must generate
      `src/gen/manifest.json` before TypeScript can resolve the asset-manifest import in `src/app/game.create.ts`.
      (`src/gen/manifest-types.ts` is a committed stub so the type-only import in `screens.types.ts` works without a
      build.)
- [ ] Run `bun run lint` and `bun run test` to lint and test changes (`bun run fix` to autofix lint + format).

## Commands

- `bun run dev` — dev server on port **3212** (AssetPack runs as a Vite plugin and watches `raw-assets/`)
- `bun run lint` — oxlint (auto-discovers `oxlint.config.ts`); `bun run fix` autofixes lint and runs oxfmt
- `bun run test` — Vitest, single run (`bun run test:watch` for watch mode)
- `bun run build` / `bun run preview` — production build / serve it locally
- `bun run clean` — wipe deps, caches, and generated assets; `bun run clean:assets` for asset caches only

## Path Aliases

| Alias | Target     | Layer         |
| ----- | ---------- | ------------- |
| `@/*` | `src/app/` | game code     |
| `#/*` | `scripts/` | build tooling |

Defined in two places that must stay in sync: `vite.config.ts` (`resolve.alias`) and `tsconfig.app.json` (`paths`).
`#/*` is also in `package.json` `imports` (needed because Node, not Bun, loads `vite.config.ts` and its plugin imports).

The engine (`∆`) alias has been removed — the engine is now the `@thalys/pixi-shared` npm package, imported by its full
subpath (e.g. `@thalys/pixi-shared/engine`, `@thalys/pixi-shared/lib/flat-grid`).

## Architecture

`src/main.ts` → `@/game` → `createApplication()` + `start()`.

- **`@thalys/pixi-shared`** — "Creation Engine" npm package: a thin wrapper around `pixi.js` `Application` (`engine`,
  singleton in `engine.singleton`). Audio, navigation, and resize are installed as PixiJS extensions (`*.plugin`).
  `navigation` manages screen lifecycle (`showScreen`, overlays). Also: flex-style layout (`layout.*`), scene helpers
  (`scene/` — sprites, text), generic utilities (`lib/` — `FlatGrid`, colors, math, random) and `utils/` (`watchObject`
  reactive state, storage, volume settings). Game-specific behavior (screen routing/persistence via
  `navigation.configure(...)`, asset manifest init) is injected by the game; screen ids are plain strings
  (`IAppScreen.definition`), with the game owning its `AppScreens` union in `@/screens/screens.types`. The PixiMixins
  namespace augmentation (`.audio`, `.navigation`, `.resizeOptions` on `Application`) lives in `src/pixi-mixins.d.ts`.
- **`src/app/`** — the game. Screens in `screens/` (`loading-screen`, `main`, `overlay`, `debug`) extend
  `screens/ScreenBase.ts`. Gameplay lives in `screens/main/`: `state.ts` (reactive `STATE` via `watchObject`),
  `UIBoard`/`UIPawn`/`UIScore`/`UIGame`, `render.ts`; board logic builds on the engine's `FlatGrid` via
  `lib/game-flat-grid.ts`. Modal dialogs in `popups/`, widget library in `ui/`.
- **`src/gen/`** — GENERATED asset manifest + types (by the AssetPack pipeline). Never edit by hand.
- **`scripts/`** — tooling, runs under Bun directly _and_ under Node when Vite loads it (keep code runtime-agnostic on
  the vite-plugin import chain; `Bun.*` is only safe in files executed exclusively by Bun, e.g.
  `scripts/bun/git/hooks/`).
- **`raw-assets/`** — source assets. Folder name tags drive the AssetPack pipeline: `{m}` = manifest bundle (`preload`,
  `main`, `loops`), `{tps}` = texture-packer sheet. Output goes to `public/assets/` (gitignored) and the manifest to
  `src/gen/`.

## Tooling Configuration

- `vite.config.ts` holds Vite server/plugin config. Format rules live in `oxfmt.config.ts`, which re-exports
  `@thalys/config-oxc/oxfmt` (no semicolons, single quotes, lowercase hex).
- Lint config is `oxlint.config.ts`, which extends `@thalys/config-oxc/oxlint`. Oxlint auto-discovers it — no `-c` flag
  needed. Type-checking is handled by `oxlint-tsgolint` (bundled in the shared config), not a separate `tsc` step.
- tsconfigs (3): `tsconfig.json` (solution file only), `tsconfig.app.json` (all of `src/` incl. tests; browser-safe
  types only), `tsconfig.node.json` (extends app; `scripts/` + root configs; adds `bun-types`/`node`). The split keeps
  Bun/Node globals out of browser code — don't merge them.

## Testing

- Test files: `src/**/*.test.ts`, imports from `'vitest'`, run with `bun run test`.
- `src/test/*.local.tsx` are scratch/experiment files, not tests.
