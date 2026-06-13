import type { OxlintOverride } from 'vite-plus/lint'
import { oxlint_typescript } from './oxlint.overrides.typescript'

// File-scoped lint overrides, composed into `overrides` of oxlint.config.ts.
// The large `**/*.ts(x)` block lives in oxlint.overrides.typescript.ts.
export const oxlint_overrides: OxlintOverride[] = [
  oxlint_typescript,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-implied-eval': 'off',
      'no-unused-vars': [
        'off',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'no-use-before-define': ['off'],
      'typescript/dot-notation': 'off',
      'typescript/await-thenable': 'error',
      'typescript/no-floating-promises': ['off'],
      'typescript/no-for-in-array': 'error',
      'typescript/no-implied-eval': 'error',
      'typescript/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      'typescript/no-unnecessary-type-assertion': 'error',
      'typescript/no-unsafe-argument': ['off'],
      'typescript/no-unsafe-assignment': ['off'],
      'typescript/no-unsafe-call': ['off'],
      'typescript/no-unsafe-member-access': ['off'],
      'typescript/no-unsafe-return': ['off'],
      'typescript/promise-function-async': 'error',
      'typescript/restrict-plus-operands': 'error',
      'typescript/restrict-template-expressions': 'error',
      'typescript/return-await': ['error', 'in-try-catch'],
      'typescript/strict-boolean-expressions': ['off'],
      'typescript/switch-exhaustiveness-check': 'error',
      'typescript/unbound-method': ['off'],
      'typescript/array-type': 'off',
      'typescript/ban-ts-comment': 'off',
      'typescript/consistent-type-definitions': 'off',
      'typescript/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      'typescript/require-await': 'off',
    },
  },
  {
    files: [
      '**/__tests__/**',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.spec.js',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.test.js',
      '**/*.bench.ts',
      '**/*.benchmark.ts',
    ],
    rules: {
      'vitest/consistent-test-it': [
        'error',
        {
          fn: 'it',
          withinDescribe: 'it',
        },
      ],
      'vitest/no-identical-title': 'error',
      'vitest/no-import-node-test': 'error',
      'vitest/prefer-hooks-in-order': 'error',
      'vitest/prefer-lowercase-title': 'error',
      'no-unused-expressions': 'off',
      'typescript/explicit-function-return-type': 'off',
    },
    jsPlugins: [],
    plugins: ['vitest'],
  },
  {
    files: ['**/*.json', '**/*.json5', '**/*.jsonc'],
    rules: {},
    jsPlugins: [],
  },
  {
    files: ['**/package.json'],
    rules: {},
    jsPlugins: [],
  },
  {
    files: ['**/tsconfig.json', '**/jsconfig.json', '**/tsconfig.*.json', '**/jsconfig.*.json'],
    rules: {},
    jsPlugins: [],
  },
  {
    files: ['**/*.yml', '**/*.yaml'],
    rules: {},
    jsPlugins: [],
  },
  {
    files: ['**/*.toml'],
    rules: {},
    jsPlugins: [],
  },
  {
    files: ['**/*.md/**'],
    rules: {
      'no-alert': 'off',
      'no-console': 'off',
      'no-labels': 'off',
      'no-lone-blocks': 'off',
      'no-undef': 'off',
      'no-unused-expressions': 'off',
      'no-unused-labels': 'off',
      'no-unused-vars': 'off',
      'unicode-bom': 'off',
      'no-redeclare': 'off',
      'no-use-before-define': 'off',
      'typescript/consistent-type-imports': 'off',
      'typescript/explicit-function-return-type': 'off',
      'typescript/no-namespace': 'off',
      'typescript/no-require-imports': 'off',
    },
    jsPlugins: [],
  },
  {
    files: ['scripts/**'],
    globals: {
      Bun: 'readonly',
    },
    rules: {
      'no-console': 'off',
      'typescript/explicit-function-return-type': 'off',
    },
    jsPlugins: [],
  },
  {
    files: ['**/cli/**', 'cli/**', '**/cli.ts', '**/cli.js'],
    rules: {
      'no-console': 'off',
    },
    jsPlugins: [],
  },
  {
    files: ['**/bin/**/*', '**/bin.ts', '**/bin.js'],
    rules: {},
    jsPlugins: [],
  },
  {
    files: ['**/*.d.ts', '**/*.d.mts', '**/*.d.cts'],
    rules: {},
    jsPlugins: [],
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    rules: {
      'typescript/no-require-imports': 'off',
    },
  },
  {
    files: [
      '**/*.config.ts',
      '**/*.config.js',
      '**/*.config.mjs',
      '*.config.ts',
      '**/*.config.*.ts',
      '**/*.config.*.js',
    ],
    rules: {
      'no-console': 'off',
      'typescript/explicit-function-return-type': 'off',
    },
    jsPlugins: [],
  },
]
