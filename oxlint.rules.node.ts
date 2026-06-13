import type { DummyRuleMap } from 'vite-plus/lint'

// Node rules (oxlint plugin: `node`, from eslint-plugin-n).
export const node_rules: DummyRuleMap = {
  'node/handle-callback-err': ['error', '^(err|error)$'],
  'node/no-exports-assign': 'error',
  'node/no-new-require': 'error',
  'node/no-path-concat': 'error',
}
