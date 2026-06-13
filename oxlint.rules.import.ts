import type { DummyRuleMap } from 'vite-plus/lint'

// Import rules (oxlint plugin: `import`, from eslint-plugin-import).
export const import_rules: DummyRuleMap = {
  'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
  'import/first': 'error',
  'import/no-duplicates': 'error',
  'import/no-mutable-exports': 'error',
  'import/no-named-default': 'error',
  'import/newline-after-import': [
    'error',
    {
      count: 1,
    },
  ],
}
