import type { OxlintConfig } from 'oxlint'
import { eslint_rules } from './oxlint.rules.eslint'
import { import_rules } from './oxlint.rules.import'
import { jsdoc_rules } from './oxlint.rules.jsdoc'
import { node_rules } from './oxlint.rules.node'
import { typescript_rules } from './oxlint.rules.typescript'
import { unicorn_rules } from './oxlint.rules.unicorn'
import { oxlint_overrides } from './oxlint.overrides'

// Imported by vite.config.ts (`lint` block) — Vite+ only reads lint config from
// there; a standalone oxlint config file is ignored once that block exists.
//
// Rules are split by oxlint plugin into oxlint.rules.<plugin>.ts and the
// file-scoped overrides into oxlint.overrides*.ts. Everything else — plugins,
// jsPlugins, categories, options, env, globals, ignorePatterns — stays here.
export const oxlint_config: OxlintConfig = {
  plugins: ['oxc', 'typescript', 'unicorn', 'react', 'node', 'jsdoc', 'import'],
  jsPlugins: [
    {
      name: 'vite-plus',
      specifier: 'vite-plus/oxlint-plugin',
    },
  ],
  categories: {
    correctness: 'warn',
  },
  options: {
    typeAware: true,
    typeCheck: true,
  },
  env: {
    builtin: true,
    es2026: true,
    browser: true,
    node: true,
  },
  globals: {
    AudioWorkletGlobalScope: 'readonly',
    AudioWorkletProcessor: 'readonly',
    currentFrame: 'readonly',
    currentTime: 'readonly',
    registerProcessor: 'readonly',
    sampleRate: 'readonly',
    WorkletGlobalScope: 'readonly',
  },
  rules: {
    ...eslint_rules,
    ...typescript_rules,
    ...unicorn_rules,
    ...import_rules,
    ...node_rules,
    ...jsdoc_rules,
    // vite-plus jsPlugin rule — prefer `vite-plus/*` over bundled-tool imports
    'vite-plus/prefer-vite-plus-imports': 'error',
  },
  overrides: oxlint_overrides,

  // Oxlint auto-reads .gitignore, so paths covered there (node_modules, dist,
  // .cache, .assetpack, public/assets, logs, editor dirs, .claude…) don't need
  // repeating. List only what's NOT gitignored but must still be skipped:
  // src/gen is generated yet committed, so gitignore can't cover it.
  ignorePatterns: ['src/gen/**'],
}
