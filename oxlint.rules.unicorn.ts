import type { DummyRuleMap } from 'vite-plus/lint'

// Unicorn rules (oxlint plugin: `unicorn`, from eslint-plugin-unicorn).
export const unicorn_rules: DummyRuleMap = {
  'unicorn/consistent-empty-array-spread': 'error',
  'unicorn/error-message': 'error',
  'unicorn/escape-case': 'error',
  'unicorn/new-for-builtins': 'error',
  'unicorn/no-instanceof-builtins': 'error',
  'unicorn/no-new-array': 'error',
  'unicorn/no-new-buffer': 'error',
  // conflicts with oxfmt, which always lowercases hex literals
  'unicorn/number-literal-case': 'off',
  'unicorn/prefer-dom-node-text-content': 'error',
  'unicorn/prefer-includes': 'error',
  'unicorn/prefer-node-protocol': 'error',
  'unicorn/prefer-number-properties': 'error',
  'unicorn/prefer-string-starts-ends-with': 'error',
  'unicorn/prefer-type-error': 'error',
  'unicorn/throw-new-error': 'error',
  'unicorn/prefer-global-this': ['error'],
}
