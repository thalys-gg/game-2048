import type { DummyRuleMap } from 'oxlint'

// JSDoc rules (oxlint plugin: `jsdoc`, from eslint-plugin-jsdoc).
export const jsdoc_rules: DummyRuleMap = {
  'jsdoc/check-access': 'warn',
  'jsdoc/check-tag-names': ['warn', { definedTags: ['note', 'complexity'] }],
  'jsdoc/empty-tags': 'warn',
  'jsdoc/require-param-name': 'warn',
  'jsdoc/require-returns-description': 'warn',
}
