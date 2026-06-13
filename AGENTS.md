<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# 2048 Game

A 2048 puzzle game built with PixiJS 8 and TypeScript. Bun is the package manager and script runtime; Vite+ (`vp`) is the toolchain.

## Commands

- `vp dev` — dev server on port **3212** (AssetPack runs as a Vite plugin and watches `raw-assets/`)
- `vp check` — format + lint + type-check in one pass (`--fix` to autofix); this replaces tsc/eslint/prettier
- `vp test` — Vitest, single run (`vp test watch` for watch mode)
- `vp build` / `vp preview` — production build / serve it locally
- `bun run clean` — wipe deps, caches, and generated assets; `bun run clean:assets` for asset caches only
- Pre-commit hook (`.vite-hooks/pre-commit`) runs `vp staged` → `vp check --fix` on staged `.ts/.tsx`

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

- `vite.config.ts` is the single config hub: Vite server/plugins, `lint`, `fmt` (no semicolons, single quotes), `staged`.
- Lint rules live in `oxlint.config.ts`, imported into the `lint` block. **Vite+ ignores standalone oxlint config files** — config only takes effect through that import.
- Oxlint override `files` globs must be plain globs (`scripts/**`); extglob patterns like `*.?([cm])ts` silently match nothing.
- `unicorn/number-literal-case` stays off: it wants uppercase hex, oxfmt enforces lowercase.
- tsconfigs (3): `tsconfig.json` (solution file only), `tsconfig.app.json` (all of `src/` incl. tests; browser-safe types only), `tsconfig.node.json` (extends app; `scripts/` + root configs; adds `bun-types`/`node`). The split keeps Bun/Node globals out of browser code — don't merge them.

## Testing

- Test files: `src/**/*.test.ts`, imports from `'vite-plus/test'` (Vitest API), run with `vp test`.
- `src/test/*.local.tsx` are scratch/experiment files, not tests.
