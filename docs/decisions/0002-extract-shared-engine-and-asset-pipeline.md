# 0002 — Extract the asset pipeline and engine into shared @thalys packages

- Status: accepted (roadmap)
- Date: 2026-06-14

## Context

The "Creation Engine" (`src/engine/`, the `∆` alias) and the AssetPack-based asset pipeline are **copy-pasted across multiple games**. Duplication means fixes and improvements have to be repeated by hand in every game. The engine↔game boundary is already clean — engine code never imports from `@/` (game) — so the engine is extractable without untangling game logic (see [architecture.md](../architecture.md)). The asset pipeline is likewise duplicated and **needs a better caching system** than it has today.

## Decision

Extract the shared layers into the `@thalys` package scope (alongside `@thalys/eslint-config`, `@thalys/tsconfig`, `@thalys/logger`, `@thalys/anime-pixi`). Each game consumes the package instead of carrying its own copy.

**Execution order:**

1. **Asset pipeline first** — extract the AssetPack setup (`raw-assets/` → `src/gen/` manifest + `public/assets/`) and improve its caching as part of the move.
2. **Engine second** — extract `src/engine/` once the pipeline it depends on is stable.

**Packaging:** start as a **single** `@thalys` package; **split into multiple packages later** as the surface grows and clearer sub-boundaries emerge.

## Consequences

- One maintained source of truth for the engine and asset pipeline; games stay thin.
- Up-front cost: package scaffolding, versioning/publishing, and migrating each game to consume the package.
- Forces the engine's public API to be made explicit (a net good for documentation and for LLM agents).
- The eventual one-package → many-packages split will be its own migration; keep module boundaries clean now to make it cheap later.
