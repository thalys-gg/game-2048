// @ts-check

import antfu from '@antfu/eslint-config'
import command from 'eslint-plugin-command/config'

export default antfu(
  {
    name: '===Base Config===',
    type: 'app',

    lessOpinionated: true,

    imports: true,
    jsonc: true, // Enable linting for JSON, JSONC, JSON5 files
    jsx: true,
    markdown: true, // Enable linting for Markdown files (e.g., code blocks)
    regexp: true,
    toml: true,
    unicorn: true, // https://github.com/sindresorhus/eslint-plugin-unicorn
    yaml: true, // Enable linting for YAML files

    nextjs: false, // Enable Next.js specific rules
    react: false, // Explicitly disable if not a React project // requires @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-react-refresh
    unocss: false, // requires @unocss/eslint-plugin
    vue: false, /* **Explicitly** disable if not a Vue project */

    stylistic: {
      jsx: false,
      overrides: {
        'style/array-bracket-newline': ['error', 'consistent'],
        'style/array-bracket-spacing': ['error', 'never'],
        'style/brace-style': ['error', '1tbs', { allowSingleLine: true }],
        'style/comma-dangle': ['error', 'always-multiline'],
        'style/comma-spacing': ['error', { before: false, after: true }],
        'style/indent': ['error', 2, { SwitchCase: 1 }],
        'style/keyword-spacing': ['error', { before: true, after: true }],
        'style/linebreak-style': ['error', 'unix'],
        'style/max-statements-per-line': ['warn', { max: 100 }],
        'style/no-multi-spaces': ['error', { ignoreEOLComments: true }],
        'style/object-curly-newline': ['error', { consistent: true }],
        'style/object-curly-spacing': ['error', 'always'],
        'style/padded-blocks': ['off'],
        'style/quotes': ['error', 'single', { avoidEscape: true }],
        'style/semi': ['error', 'never'],
        'style/space-before-function-paren': ['error', 'always'],
        'style/space-in-parens': ['error', 'never'],
        'style/no-trailing-spaces': ['error'],
        'style/no-multiple-empty-lines': ['error', { max: 2, maxBOF: 0, maxEOF: 1 }],
      },
    },
    typescript: {
      filesTypeAware: ['src/**/*.{ts,tsx}'],
      tsconfigPath: './tsconfig.json',
      overridesTypeAware: {
        'ts/no-use-before-define': ['off'],
        'ts/no-floating-promises': ['off'],
        'ts/no-unsafe-argument': ['off'],
        'ts/no-unsafe-assignment': ['off'],
        'ts/no-unsafe-call': ['off'],
        'ts/no-unsafe-member-access': ['off'],
        'ts/no-unsafe-return': ['off'],
        'ts/strict-boolean-expressions': ['off'],
        'ts/unbound-method': ['off'],
        'ts/array-type': 'off',
        'ts/consistent-type-definitions': 'off',
        'ts/consistent-type-imports': ['warn', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
        'ts/no-unused-vars': ['off', { argsIgnorePattern: '^_' }],
        'ts/require-await': 'off',
        'ts/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
        'ts/ban-ts-comment': 'off',
      },
    },
    formatters: { // requires eslint-plugin-format
      css: true,
      html: true,
      markdown: 'dprint',
    },
    ignores: [
      '!src/*.local.{ts,tsx}',
      '.assetpack',
      '.cache',
      'build',
      'dist',
      'llms',
      'node_modules',
      'out',
    ],
  },
  {
    // NOTE - Global miscellaneous rules
    rules: {
      'curly': ['error', 'multi-line', 'consistent'],
      'unicorn/prevent-abbreviations': ['off'],
      'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
      'unused-imports/no-unused-vars': ['off'],
    },
  },
  {
    // NOTE - Rules to help avoid easy mistakes on `pixi.js` projects
    rules: {
      'unicorn/prefer-global-this': ['error'], // e.g. use `globalThis` instead of `window`
      'no-implicit-globals': ['error'],
      'no-restricted-globals': [
        'error',
        {
          name: 'screen',
          message: '\nUse `screen` from PixiJS',
        },
        {
          name: 'Text',
          message: '\nUse `Text` from PixiJS',
        },
      ],
    },
  },
  command(),
)
