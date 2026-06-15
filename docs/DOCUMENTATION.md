# Documentation standard

How this repository is documented. The goal is a **dual audience**: a human reading it understands *why* things are designed the way they are, and an LLM agent working on the code gets the same context — what exists, where to find it, and what is reusable.

This standard is meant to be **reusable across repos**. Copy `docs/` (this file, the ADR layout, an `architecture.md`) into each game/project so every repo is self-describing.

## Three layers

| Layer | Answers | Lives in |
| ----- | ------- | -------- |
| **High-level** | What is this, how is it wired, *why these choices* | [`AGENTS.md`](../AGENTS.md) (brief entry), [`docs/architecture.md`](architecture.md) (diagram), [`docs/decisions/`](decisions/) (ADRs for the *why*) |
| **Module** | What is this directory's job, how does it work | a `README.md` in each major `src/` directory + a TSDoc `@packageDocumentation` header on the module's entry file |
| **Function / symbol** | What does this do, params, returns, gotchas | TSDoc on every exported symbol |

## Conventions

### High-level
- Keep `AGENTS.md` brief and reachable (aim < 200 lines): commands, path aliases, architecture summary, tooling gotchas. Link out to `docs/` for depth instead of inlining it.
- Diagrams are **Mermaid in markdown** — plain text, so they version, diff, and are readable by both humans and LLMs (no binary images to rot). GitHub renders them.
- Record decisions as **ADRs** (see below). The *why* is the most valuable and most perishable knowledge.

### Module
- One `README.md` per major directory (e.g. `src/engine/`, `src/app/screens/`): one paragraph on the directory's responsibility, key files, and how it's used. Link to related ADRs.
- The module's entry file carries a TSDoc `@packageDocumentation` comment summarizing the module.

### Function / symbol
- TSDoc on all exports: `@param name - …`, `@returns`, `@remarks`, `@example` where it earns its place.
- **Do not** repeat TypeScript types in the comment (no `{type}` annotations) — the types are the source of truth.
- Enforced with **oxlint** (`oxlint.rules.jsdoc.ts`), not ESLint.

## Architecture Decision Records (ADRs)

Lightweight [MADR](https://adr.github.io/madr/)-style records in [`docs/decisions/`](decisions/), numbered sequentially (`0001-…`, `0002-…`). Each one captures: **context** (the forces at play), the **decision**, its **consequences**, and the **alternatives considered**. Write one whenever a choice would otherwise leave a future reader (human or LLM) asking "why is it like this?".

## LLM index

[`llms.txt`](../llms.txt) is a curated index ([llms.txt](https://llmstxt.org/) format) pointing agents at the docs above. Keep it current when docs move.

## Phasing

This is **Phase 1**: conventions applied by hand, kept reusable. **Phase 2** (when there are several games, or upkeep starts to hurt) adds cheap automation — `codebase-map`, an `llms.txt` generator — and only then a generated API reference (TypeDoc) with CI doc-gates if a published API earns it. See [ADR 0001](decisions/0001-adopt-layered-documentation-standard.md).
