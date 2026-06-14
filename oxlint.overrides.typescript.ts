import type { OxlintOverride } from 'oxlint'

// The `**/*.ts(x)` lint override — disables core rules made redundant by the
// TypeScript compiler and enables typescript-eslint rules. Composed into the
// override array in oxlint.overrides.ts.
export const oxlint_typescript: OxlintOverride = {
  files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.tsx'],
  rules: {
    'constructor-super': 'off',
    'getter-return': 'off',
    'no-class-assign': 'off',
    'no-const-assign': 'off',
    'no-dupe-keys': 'off',
    'no-func-assign': 'off',
    'no-import-assign': 'off',
    'no-new-native-nonconstructor': 'off',
    'no-obj-calls': 'off',
    'no-redeclare': [
      'error',
      {
        builtinGlobals: false,
      },
    ],
    'no-setter-return': 'off',
    'no-this-before-super': 'off',
    'no-undef': 'off',
    'no-unreachable': 'off',
    'no-unsafe-negation': 'off',
    'no-with': 'off',
    'prefer-const': 'error',
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTaggedTemplates: true,
        allowTernary: true,
      },
    ],
    'no-unused-vars': 'off',
    'no-useless-constructor': 'off',
    'no-use-before-define': [
      'error',
      {
        classes: false,
        functions: false,
        variables: true,
      },
    ],
    'typescript/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
      },
    ],
    'typescript/no-duplicate-enum-values': 'error',
    'typescript/no-dynamic-delete': 'off',
    'typescript/no-empty-object-type': [
      'error',
      {
        allowInterfaces: 'always',
      },
    ],
    'typescript/no-explicit-any': 'off',
    'typescript/no-extra-non-null-assertion': 'error',
    'typescript/no-extraneous-class': 'off',
    'typescript/no-invalid-void-type': 'off',
    'typescript/no-misused-new': 'error',
    'typescript/no-namespace': 'error',
    'typescript/no-non-null-asserted-nullish-coalescing': 'error',
    'typescript/no-non-null-asserted-optional-chain': 'error',
    'typescript/no-non-null-assertion': 'off',
    'typescript/no-require-imports': 'error',
    'typescript/no-this-alias': 'error',
    'typescript/no-unnecessary-type-constraint': 'error',
    'typescript/no-unsafe-declaration-merging': 'error',
    'typescript/no-unsafe-function-type': 'error',
    'typescript/no-wrapper-object-types': 'error',
    'typescript/prefer-as-const': 'error',
    'typescript/prefer-literal-enum-member': 'error',
    'typescript/prefer-namespace-keyword': 'error',
    'typescript/triple-slash-reference': 'off',
    'typescript/unified-signatures': 'off',
    'typescript/consistent-type-definitions': ['error', 'interface'],
    'typescript/consistent-type-imports': [
      'error',
      {
        disallowTypeAnnotations: false,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      },
    ],
    'typescript/no-import-type-side-effects': 'error',
  },
}
