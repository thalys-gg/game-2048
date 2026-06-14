/// <reference types="vitest/config" />
import type { OxlintConfig } from 'oxlint'
import { eslint_rules } from './oxlint.rules.eslint.ts'
import { import_rules } from './oxlint.rules.import.ts'
import { jsdoc_rules } from './oxlint.rules.jsdoc.ts'
import { node_rules } from './oxlint.rules.node.ts'
import { typescript_rules } from './oxlint.rules.typescript.ts'
import { unicorn_rules } from './oxlint.rules.unicorn.ts'
import { oxlint_overrides } from './oxlint.overrides.ts'

// Loaded by oxlint via `-c oxlint.config.ts` (see the `lint`/`fix` scripts in
// package.json). oxlint reads the default export, so this file ends with one.
//
// Rules are split by oxlint plugin into oxlint.rules.<plugin>.ts and the
// file-scoped overrides into oxlint.overrides*.ts. Everything else — plugins,
// jsPlugins, categories, options, env, globals, ignorePatterns — stays here.
export const oxlint_config: OxlintConfig = {
  plugins: ['oxc', 'typescript', 'unicorn', 'react', 'node', 'jsdoc', 'import'],
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
  },
  overrides: oxlint_overrides,

  // Oxlint auto-reads .gitignore, so paths covered there (node_modules, dist,
  // .cache, .assetpack, public/assets, logs, editor dirs, .claude…) don't need
  // repeating. List only what's NOT gitignored but must still be skipped:
  // src/gen is generated yet committed, so gitignore can't cover it.
  ignorePatterns: ['src/gen/**'],
}

export default oxlint_config
