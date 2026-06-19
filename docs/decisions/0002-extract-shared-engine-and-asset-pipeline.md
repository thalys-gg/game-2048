# 0002 — Extract the asset pipeline and engine into shared @thalys packages

- Status: partially implemented
- Date: 2026-06-14
- Updated: 2026-06-19

## Context

The "Creation Engine" (`src/engine/`, the `∆` alias) and the AssetPack-based asset pipeline are **copy-pasted across multiple games**. Duplication means fixes and improvements have to be repeated by hand in every game. The engine↔game boundary is already clean — engine code never imports from `@/` (game) — so the engine is extractable without untangling game logic (see [architecture.md](../architecture.md)). The asset pipeline is likewise duplicated and **needs a better caching system** than it has today.

## Decision

Extract the shared layers into the `@thalys` package scope (alongside `@thalys/eslint-config`, `@thalys/tsconfig`, `@thalys/logger`, `@thalys/anime-pixi`). Each game consumes the package instead of carrying its own copy.

**Execution order:**

1. **Asset pipeline first** — extract the AssetPack setup (`raw-assets/` → `src/gen/` manifest + `public/assets/`) and improve its caching as part of the move.
2. **Engine second** — extract `src/engine/` once the pipeline it depends on is stable.

**Packaging:** start as a **single** `@thalys` package; **split into multiple packages later** as the surface grows and clearer sub-boundaries emerge.

## Implementation

**Engine extraction — complete (2026-06-19):**

- `src/engine/` deleted from this repo; all 50 `∆/` import lines in `src/app/` rewritten to `@thalys/pixi-shared/<subpath>`.
- Package published at `@thalys/pixi-shared@0.1.0` (GitHub Packages, restricted).
- The `∆` path alias removed from `vite.config.ts` and `tsconfig.app.json`.
- `src/pixi-mixins.d.ts` kept in this repo (imports types from the package) to apply the PixiMixins global namespace augmentation that TypeScript needs to type `Application.audio` / `.navigation` / `.resizeOptions`.

**Asset pipeline extraction — pending.**

## Consequences

- One maintained source of truth for the engine; games stay thin.
- Up-front cost: package scaffolding, versioning/publishing, and migrating each game to consume the package.
- Forces the engine's public API to be made explicit (a net good for documentation and for LLM agents).
- The eventual one-package → many-packages split will be its own migration; keep module boundaries clean now to make it cheap later.
