# 2048 Game

A 2048 puzzle game built with PixiJS 8 and TypeScript. Bun is the package manager and script runtime; Vite is the bundler/dev server, with oxlint + oxfmt for lint/format and Vitest for tests.

## Documentation

- [docs/architecture.md](docs/architecture.md) — layered diagram + the engine↔game boundary
- [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) — the documentation standard (how this repo is documented)
- [docs/decisions/](docs/decisions/) — ADRs (the *why* behind key choices)
- [llms.txt](llms.txt) — curated index for LLM agents

## Review Checklist

- [ ] Run `bun install` after pulling remote changes and before getting started.
- [ ] Run `bun run lint`, `bun run typecheck`, and `bun run test` to lint, type-check, and test changes (`bun run fix` to autofix lint + format).

## Commands

- `bun run dev` — dev server on port **3212** (AssetPack runs as a Vite plugin and watches `raw-assets/`)
- `bun run lint` — oxlint (`oxlint -c oxlint.config.ts`); `bun run fix` autofixes lint and runs oxfmt
- `bun run typecheck` — type-check both tsconfig projects (`tsc --noEmit` on app + node)
- `bun run test` — Vitest, single run (`bun run test:watch` for watch mode)
- `bun run build` / `bun run preview` — production build / serve it locally
- `bun run clean` — wipe deps, caches, and generated assets; `bun run clean:assets` for asset caches only

## Path Aliases

| Alias | Target        | Layer                |
| ----- | ------------- | -------------------- |
| `∆/*` | `src/engine/` | reusable engine code |
| `@/*` | `src/app/`    | game code            |
| `#/*` | `scripts/`    | build tooling        |

Defined in three places that must stay in sync: `vite.config.ts` (`resolve.alias`), `tsconfig.app.json` (`paths`), and package.json `imports` (`#/*` only — needed because Node, not Bun, loads `vite.config.ts` and its plugin imports).

## Architecture

`src/main.ts` → `@/game` → `createApplication()` + `start()`.

- **`src/engine/`** — "Creation Engine": a thin wrapper around `pixi.js` `Application` (`engine.ts`, singleton in `engine.singleton.ts`). Audio, navigation, and resize are installed as PixiJS extensions (`*.plugin.ts`). `navigation.ts` manages screen lifecycle (`showScreen`, overlays). Also: flex-style layout (`layout.*`), scene helpers (`scene/` — sprites, text), generic utilities (`lib/` — `FlatGrid`, colors, math, random) and `utils/` (`watchObject` reactive state, storage, user settings). Engine code must not import from `@/`.
- **`src/app/`** — the game. Screens in `screens/` (`loading-screen`, `main`, `overlay`, `debug`) extend `screens/ScreenBase.ts`. Gameplay lives in `screens/main/`: `state.ts` (reactive `STATE` via `watchObject`), `UIBoard`/`UIPawn`/`UIScore`/`UIGame`, `render.ts`; board logic builds on the engine's `FlatGrid` via `lib/game-flat-grid.ts`. Modal dialogs in `popups/`, widget library in `ui/`.
- **`src/gen/`** — GENERATED asset manifest + types (by the AssetPack pipeline). Never edit by hand.
- **`scripts/`** — tooling, runs under Bun directly _and_ under Node when Vite loads it (keep code runtime-agnostic on the vite-plugin import chain; `Bun.*` is only safe in files executed exclusively by Bun, e.g. `scripts/bun/git/hooks/`).
- **`raw-assets/`** — source assets. Folder name tags drive the AssetPack pipeline: `{m}` = manifest bundle (`preload`, `main`, `loops`), `{tps}` = texture-packer sheet. Output goes to `public/assets/` (gitignored) and the manifest to `src/gen/`.

## Tooling Configuration

- `vite.config.ts` holds Vite server/plugin config. Format rules (no semicolons, single quotes) live in `.oxfmtrc.json`.
- Lint config is `oxlint.config.ts` (a TS config with a `default` export), loaded via `oxlint -c oxlint.config.ts` in the `lint`/`fix` scripts. Its relative imports use explicit `.ts` extensions because Node (which oxlint uses to load the config) won't resolve extensionless paths. Rules are split into `oxlint.rules.<plugin>.ts` and overrides into `oxlint.overrides*.ts`.
- Oxlint override `files` globs must be plain globs (`scripts/**`); extglob patterns like `*.?([cm])ts` silently match nothing.
- `unicorn/number-literal-case` stays off: it wants uppercase hex, oxfmt enforces lowercase.
- tsconfigs (3): `tsconfig.json` (solution file only), `tsconfig.app.json` (all of `src/` incl. tests; browser-safe types only), `tsconfig.node.json` (extends app; `scripts/` + root configs; adds `bun-types`/`node`). The split keeps Bun/Node globals out of browser code — don't merge them.

## Testing

- Test files: `src/**/*.test.ts`, imports from `'vitest'`, run with `bun run test`.
- `src/test/*.local.tsx` are scratch/experiment files, not tests.
