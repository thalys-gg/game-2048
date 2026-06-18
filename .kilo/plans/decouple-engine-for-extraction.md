# Decouple `src/engine/` for extraction into shareable package(s)

## Goal

Make `src/engine/` a fully self-contained, reusable engine with **zero** imports from
game code (`@/`), the generated asset manifest (`../gen`), or anything else
game-specific. Do this **in-repo first** (behavior-preserving), organized so the
engine can later be carved into **one or several** shareable npm packages
(separate repo, published under the `@thalys` scope). Package granularity is
decided during Stage 3, not now.

## Decisions (locked)

- **Distribution target:** separate git repo, published to npm under `@thalys`.
  This happens *after* in-repo decoupling; the immediate work is decoupling.
- **Navigation:** screen-agnostic — string screen ids + game-injected routing.
- **Asset init:** moves **out of the engine entirely** into the game.
- **user.settings:** split — engine keeps generic volume settings; game owns
  last-screen persistence.
- **Packaging:** possibly multiple small packages rather than one monolith;
  exact count is a Stage 3 decision.

## Constraints

- This agent plans only. Implementation requires switching to an
  implementation-capable agent (source edits + `bun run` validation).
- Every Stage 1 change must be **behavior-preserving** (the running game must
  look and act identically). No feature changes.
- Engine code must never import from `@/`, `../gen`, or `../app`.
- Keep `pixi.js`, `@pixi/sound`, and `motion` as external/peer deps of the engine.

## Current coupling (audited)

Game-specific dependencies currently living inside `src/engine/`:

1. `navigation.ts`
   - imports concrete game screens: `@/screens/debug/ScreenInput`,
     `@/screens/debug/ScreenPawn`, `@/screens/main/ScreenMain`.
   - hardcodes routing: `crossReference`, `matchRefScreen`, `_onPopState`
     (back button → `ScreenMain`), `showLastSessionScreen`.
   - uses game-specific `AppScreens` union + `userSettings.get/setLastScreen`.
2. `types.screen.ts` — `appScreens` const array / `AppScreens` union enumerate
   game screens (`ScreenMain`, `GameOver`, `GameWon`, `PopupSettings`, …).
3. `engine.ts` — `import manifest from '../gen/manifest.json'`; runs
   `Assets.init` + `loadBundle('preload')` + `backgroundLoadBundle`.
4. `types.asset.ts` — `TAssetBundleId` derived from `../gen/manifest-types`.
5. `utils/user.settings.ts` — generic volume settings mixed with
   `getLastScreen/setLastScreen` typed by `AppScreens`.
6. `scene/stage-ruler.ts` — imports `IAppScreen`, `TAssetBundleId` from `∆/types`.

Game side consumes the engine via ~46 `∆/` imports across ~30 files (entry:
`src/app/game.create.ts`). These keep working through Stage 1–2; their import
specifiers only change at extraction time (Stage 3).

---

## Stage 1 — Remove every game→engine seam (in repo, behavior-preserving)

### 1.1 Screen types (`types.screen.ts`)
- [ ] Remove the `appScreens` const array and the `AppScreens` union from the
      engine.
- [ ] `IAppScreen.definition: string` (was `AppScreens`).
- [ ] `IAppScreen.assetBundles?: string[]` and
      `IAppScreenConstructor.assetBundles: string[]` (was `TAssetBundleId[]`).
- [ ] Move the game's own `AppScreens` union + `appScreens` array into the game
      (e.g. `src/app/screens/screens.types.ts`) for the game's internal
      type-safety; game screens set `definition` to those string literals.

### 1.2 Navigation (`navigation.ts`, `navigation.plugin.ts`)
- [ ] Delete `@/screens/*` imports and the `AppScreens`/`userSettings` imports.
- [ ] Introduce a game-supplied routing config injected at init, e.g.:
      ```ts
      interface NavigationConfig {
        getBackScreen?: () => IAppScreenConstructor          // _onPopState target
        resolveLastScreen?: (id: string) => IAppScreenConstructor | null
        persistLastScreen?: (id: string) => void
        shouldPersist?: (id: string) => boolean              // replaces crossReference filter
      }
      ```
      Exact shape finalized during implementation; principle = engine holds no
      game screen knowledge.
- [ ] `_onKeyDown`/`_onPopState` call `config.getBackScreen()` instead of
      `ScreenMain`.
- [ ] Replace `crossReference`/`matchRefScreen`/`showLastSessionScreen` engine
      logic with calls into the injected config; move the concrete
      screen-name→constructor mapping into the game.
- [ ] `showScreen` persistence uses `config.persistLastScreen` /
      `config.shouldPersist` instead of `userSettings.setLastScreen`.
- [ ] Update `navigation.plugin.ts` / engine bootstrap to thread the config
      through (game passes it via `engine.init` options or a
      `navigation.configure(...)` call — pick one during implementation).
- [ ] Game side: implement the router config (the moved `crossReference` /
      `matchRefScreen` / back-target / last-session logic) and register it.

### 1.3 Asset init (`engine.ts`, `types.asset.ts`)
- [ ] Remove `import manifest from '../gen/manifest.json'` and the
      `Assets.init` / `loadBundle('preload')` / `backgroundLoadBundle` block
      from `engine.ts`. `engine.init` shrinks to: `super.init`, canvas append,
      visibility listener.
- [ ] Delete `types.asset.ts` (`TAssetBundleId`) and remove it from the
      `types.ts` barrel and all engine consumers.
- [ ] Game side: move asset bootstrapping into `src/app/game.create.ts`
      (`createApplication`) — `Assets.init({ manifest, basePath })`,
      `loadBundle('preload')`, `backgroundLoadBundle(allBundles)` — using the
      game's `src/gen/manifest.json`.

### 1.4 user.settings (`utils/user.settings.ts`)
- [ ] Keep a generic `UserSettings` in the engine for master/bgm/sfx volume
      (built on `engine().audio` + `storage`); remove `AppScreens`,
      `getLastScreen`, `setLastScreen`.
- [ ] Move last-screen persistence to the game (plain `string`), co-located with
      the new navigation router config (1.2).

### 1.5 stage-ruler (`scene/stage-ruler.ts`)
- [ ] Remove `import type { IAppScreen, TAssetBundleId }` and any reliance on
      screen/asset types; keep it a self-contained dev overlay
      (`Ruler` + `RulerOptions`).

### 1.6 Validate Stage 1
- [ ] `bun run typecheck` (app + node) passes.
- [ ] `bun run lint` passes.
- [ ] `bun run test` passes (incl. `flat-grid.test.ts`).
- [ ] `bun run dev` — manual smoke test: load, navigation between screens, back
      button / Escape, popups, audio + volume settings, last-screen restore,
      ruler overlay toggle — all unchanged.

---

## Stage 2 — Enforce the boundary + organize modules

- [ ] Confirm **zero** matches for `@/`, `../gen`, `../app` inside `src/engine`
      (rg sweep).
- [ ] Add an enforced boundary rule so future game imports into engine fail CI
      (oxlint `no-restricted-imports` patterns for `@/*`, `../app/*`,
      `../gen/*`, or an equivalent import-restriction check). Document it in
      `AGENTS.md`.
- [ ] Give each engine module group a clean public entry (`index.ts`) exporting
      only its intended surface, so each group can stand alone later.
- [ ] Re-run `bun run typecheck && bun run lint && bun run test`.

---

## Stage 3 — Carve into shareable package(s) (granularity decided here)

Candidate module groupings (from the audited dependency graph; pure-TS groups
are the easiest first extractions):

| Group | Files | External deps |
| --- | --- | --- |
| `lib` | array, math, random, fn, promise, string, object, colors(.definitions/.utils), flat-grid, types | none (pure TS) |
| `reactivity` | utils/watch, utils/watch.types | none |
| `storage` | storage | none |
| `layout` | layout, layout.flex, layout.utils, layout.types | pixi.js |
| `scene` | sprite(.ts/.animated/.DOOM), text(.ts/.abstract/.fn/.types), stage-ruler | pixi.js |
| `pixi-utils` | utils/pixijs(.types), utils/assets, utils/getResolution | pixi.js, @pixi/sound |
| `engine-core` | engine, engine.singleton, audio(+plugin), navigation(+plugin), resize(+plugin), types.* | pixi.js, @pixi/sound, motion |

Decision to make during this stage (the deferred "as we go" item):
- **One package vs several.** Recommended starting point: extract the pure-TS
  groups (`lib`, `reactivity`, `storage`) first as low-risk standalone packages,
  then decide whether the pixi groups ship as one `engine` package or several.
- For each package: name (`@thalys/…`), `package.json` `exports` map (preserve
  subpath imports so consumers map cleanly), `pixi.js`/`@pixi/sound`/`motion` as
  `peerDependencies`, build tooling (tsup or vite lib mode + `.d.ts`), and
  tooling parity (oxlint/oxfmt/tsc/vitest).

Extraction mechanics (per package, once boundaries are chosen):
- [ ] New git repo; move files; set up build + publish (npm, `@thalys` scope).
- [ ] Replace the game's `∆/*` (and any subpath) imports with the published
      package specifier(s); update `tsconfig.app.json` `paths`, `vite.config.ts`
      `resolve.alias`, and remove the `∆` alias once nothing uses it.
- [ ] During development consume via `bun link` / `file:` before first publish.
- [ ] `bun run typecheck && bun run lint && bun run test && bun run build` green
      in the game against the packaged engine.

---

## Risks / watch-outs

- **Navigation config injection** is the riskiest change (touches bootstrap,
  back-button, and last-session restore). Keep the injected config shape minimal
  and verify the full navigation flow manually.
- **`engine.init` signature change** (asset init removed) — ensure
  `game.create.ts` performs asset bootstrapping in the same order before any
  screen needs assets, to avoid load races.
- **`erasableSyntaxOnly: false` / `verbatimModuleSyntax: true`** — keep
  type-only imports correct when moving types between engine and game.
- **`isolatedModules`** — re-exported types from barrels must use `export type`.

## Out of scope

- No gameplay or visual changes.
- No new engine features; decoupling only.
- Final npm publish/CI for the extracted package(s) is set up in Stage 3, not
  before the boundaries are chosen.

## Validation gate (every stage)

`bun install` → `bun run lint` → `bun run typecheck` → `bun run test`
(`bun run fix` to autofix), plus a `bun run dev` smoke test after Stage 1.
