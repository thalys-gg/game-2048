# 0001 — Adopt a layered, dual-audience documentation standard

- Status: accepted
- Date: 2026-06-14

## Context

These projects are growing into a portfolio of games that share an engine. Two readers need context: the author
(returning months later, needing to remember _why_ things are designed a certain way) and LLM coding agents (which need
to know what already exists and where, so they reuse rather than rebuild). Documentation today is uneven — `AGENTS.md`
is good, but there are no module docs, almost no function-level docs (despite a "JSDoc on exports" rule), and the
`.llmstxt` index is empty.

## Decision

Adopt a **three-layer documentation standard** (high-level → module → function), documented in
[`docs/DOCUMENTATION.md`](../DOCUMENTATION.md), and treat it as a **reusable standard copied into each repo** so future
games inherit it cheaply. Diagrams are Mermaid-in-markdown; the _why_ is captured in ADRs; function docs use TSDoc
enforced by **oxlint** (not ESLint).

Roll out in phases (Approach "C", hybrid): conventions by hand now; automation (codebase-map, llms.txt generator, and
possibly a generated TypeDoc API site with CI gates) deferred until scale justifies it.

## Consequences

- Knowledge lives close to the code it describes and is readable by humans and LLMs alike.
- Some manual discipline is required in Phase 1 (module READMEs and `.llmstxt` are maintained by hand).
- The standard must be copied/kept in sync across repos until Phase 2 automation exists.

## Alternatives considered

- **Convention-only, forever (no generators ever).** Lowest tooling, but gives up an eventual published API reference
  and freshness guarantees.
- **Full doc-as-code pipeline now** (TypeDoc + generated `llms.txt` + CI doc-gates). Strong guarantees, but heavy setup
  and per-repo CI upkeep — not worth it for a single early game. Revisit in Phase 2.
- **ESLint-based doc linting** (`eslint-plugin-tsdoc`/`jsdoc`). Rejected: ESLint is slow and noisy; the repos
  standardize on oxlint.
