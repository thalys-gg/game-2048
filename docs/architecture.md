# Architecture

A visual companion to the architecture notes in [AGENTS.md](../AGENTS.md). For commands, path aliases, and tooling details, see AGENTS.md; this page focuses on how the pieces fit and the boundaries that matter.

## Overview

```mermaid
flowchart TB
  entry["entry — src/main.ts → @/game<br/>createApplication() + start()"]

  subgraph game["game layer · src/app (@)"]
    g1["screens: loading · main · overlay · debug"]
    g2["main: STATE + render<br/>UIBoard · UIPawn · UIScore · UIGame"]
    g3["lib/game-flat-grid"]
    g4["popups · ui widgets"]
  end

  subgraph engine["creation engine · src/engine (∆) — reusable"]
    e1["engine.ts + singleton<br/>pixi.js Application wrapper"]
    e2["plugins: audio · navigation · resize"]
    e3["layout (flex) · scene: sprite · text"]
    e4["lib: FlatGrid · colors · math · random<br/>utils: watchObject · storage · settings · assets"]
  end

  assets["asset pipeline — raw-assets/ → AssetPack (Vite plugin)<br/>→ src/gen (manifest) + public/assets"]
  pixi["external · pixi.js 8"]

  entry --> game
  game -->|"depends on (one way)"| engine
  engine --> pixi
  assets -.->|"manifest + textures"| game
  assets -.-> engine
```

## Layers

| Layer | Alias | Path | Responsibility |
| ----- | ----- | ---- | -------------- |
| Game | `@/*` | `src/app/` | The 2048 game: screens, reactive `STATE`, board UI, popups, widgets. |
| Engine | `∆/*` | `src/engine/` | "Creation Engine": a thin wrapper over the pixi.js `Application` plus navigation, layout, scene helpers, and utilities. |
| Build tooling | `#/*` | `scripts/` | AssetPack/Vite plugins and build scripts (runtime-agnostic on the Vite plugin chain). |
| Generated | — | `src/gen/` | Asset manifest + types produced by AssetPack. Never edited by hand. |
| Source assets | — | `raw-assets/` | Inputs to AssetPack; output is gitignored `public/assets/`. |

## The boundary that matters

**The engine never imports from `@/` (game code).** The dependency flows one way: game → engine. That single invariant is what makes `src/engine/` extractable into a shared package without untangling game logic.

See [ADR 0002](decisions/0002-extract-shared-engine-and-asset-pipeline.md) for the plan to extract the asset pipeline and engine into reusable `@thalys` packages.
