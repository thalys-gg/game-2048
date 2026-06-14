import type { DummyRuleMap } from 'oxlint'

// TypeScript rules (oxlint plugin: `typescript`, from typescript-eslint).
// Base, non-type-aware rules only — the type-aware and disable toggles live in
// the `**/*.ts` and `src/**` overrides (oxlint.overrides.*).
export const typescript_rules: DummyRuleMap = {
  'typescript/dot-notation': [
    'error',
    {
      allowKeywords: true,
    },
  ],
}
