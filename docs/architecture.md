# Architecture

A visual companion to the architecture notes in [AGENTS.md](../AGENTS.md). For commands, path aliases, and tooling
details, see AGENTS.md; this page focuses on how the pieces fit and the boundaries that matter.

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

  subgraph engine["@thalys/pixi-shared — npm package (external)"]
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

| Layer         | Alias | Path                  | Responsibility                                                                                                                          |
| ------------- | ----- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Game          | `@/*` | `src/app/`            | The 2048 game: screens, reactive `STATE`, board UI, popups, widgets.                                                                    |
| Engine        | —     | `@thalys/pixi-shared` | "Creation Engine" npm package: pixi.js `Application` wrapper, navigation, layout, scene helpers, utilities. Imported by subpath export. |
| Build tooling | `#/*` | `scripts/`            | AssetPack/Vite plugins and build scripts (runtime-agnostic on the Vite plugin chain).                                                   |
| Generated     | —     | `src/gen/`            | Asset manifest + types produced by AssetPack. Never edited by hand.                                                                     |
| Source assets | —     | `raw-assets/`         | Inputs to AssetPack; output is gitignored `public/assets/`.                                                                             |

## The boundary that matters

Game code imports from `@thalys/pixi-shared` subpaths (e.g. `@thalys/pixi-shared/engine`,
`@thalys/pixi-shared/lib/flat-grid`). The engine package has no knowledge of the game — it is a generic PixiJS wrapper.
Game-specific behaviour (screen routing, asset manifest init) is injected by the game at startup.

See [ADR 0002](decisions/0002-extract-shared-engine-and-asset-pipeline.md) — engine extraction is complete as of v0.1.0.
