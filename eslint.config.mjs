// @ts-check

import antfu from '@antfu/eslint-config'
import { comments, imports, perfectionist, pixijs, stylistic, typescript, unicorn } from '@thalys/eslint-config'

export default antfu(
  {
    name: '===Base Config===',
    type: 'app',

    stylistic,

    typescript: {
      filesTypeAware: ['src/**/*.{ts,tsx}'],
      tsconfigPath: './tsconfig.app.json',
      overridesTypeAware: typescript.overridesTypeAware,
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
  unicorn,
  imports,
  comments,
  perfectionist,
  pixijs,
)
