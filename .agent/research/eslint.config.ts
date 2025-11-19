// eslint.config.ts
import type { Linter } from 'eslint';
import { defineConfig } from 'eslint/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { configs as tsEslintConfigs } from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import { configs as sonarjsConfigs } from 'eslint-plugin-sonarjs';
import eslint from '@eslint/js';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import { importX } from 'eslint-plugin-import-x';
import globals from 'globals';

const baseDir = path.dirname(fileURLToPath(import.meta.url));

/* -------------------------------------------------------------------------- */
/* Base setup                                                                 */
/* -------------------------------------------------------------------------- */

const baseLanguageOptions: Linter.LanguageOptions = {
  globals: { ...globals.node, ...globals.es2022 },
};

const baseIgnores = [
  '**/dist/**',
  '**/node_modules/**',
  '**/build/**',
  '**/.turbo/**',
  '**/coverage/**',
  '**/*.typegen.ts',
  '**/*.d.ts',
  'bin.cjs',
  'examples/**',
  '**/*.md',
  '**/*.json',
  '**/*.yaml',
  '**/*.yml',
  '**/.prettierignore',
  '**/.eslintignore',
  '**/.vscode/**',
  '**/package.json',
  '**/pnpm-lock.yaml',
  '**/.DS_Store',
  '**/*.hbs',
  '**/tests-generated/.tmp/**',
];

const testGlobs = [
  '**/*.test.{ts,tsx}',
  '**/*.spec.{ts,tsx}',
  '**/test-*.ts',
  '**/__tests__/**',
  '**/tests-snapshot/**/*.ts',
  '**/characterisation/**/*.ts',
];

const baseConfig = [
  eslint.configs.recommended,
  importX.flatConfigs.recommended,
  sonarjsConfigs.recommended,
  prettierRecommended,
] as const;

/* -------------------------------------------------------------------------- */
/* Presets                                                                    */
/* -------------------------------------------------------------------------- */

const tsUntypedPresets = [
  importX.flatConfigs.typescript,
  ...tsEslintConfigs.strict,
  ...tsEslintConfigs.stylistic,
] as const;

/* -------------------------------------------------------------------------- */
/* Rules                                                                      */
/* -------------------------------------------------------------------------- */

const baseRules: Linter.RulesRecord = {
  'no-console': 'error',
  'no-debugger': 'error',
  'no-empty': 'error',
  'no-empty-function': 'error',
  'no-constant-condition': 'error',
  'prefer-const': 'error',
  'no-var': 'error',
};

const untypedTsRules: Linter.RulesRecord = {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': ['error', {}],
  '@typescript-eslint/no-explicit-any': ['error', { fixToUnknown: true }],
  '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
  '@typescript-eslint/consistent-type-imports': [
    'error',
    { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
  ],
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  '@typescript-eslint/no-non-null-assertion': 'error',
  '@typescript-eslint/no-restricted-types': [
    'error',
    {
      types: {
        'Record<string, unknown>': {
          message:
            'Avoid Record<string, unknown>. It destroys type information. Refactor or use a defined type.',
        },
      },
    },
  ],
  complexity: ['error', 8],
  'sonarjs/cognitive-complexity': ['error', 8],
  'max-lines': ['error', { max: 220, skipBlankLines: true, skipComments: true }],
  'max-lines-per-function': ['error', { max: 45, skipBlankLines: true, skipComments: true }],
  'max-statements': ['error', 20],
  'max-depth': ['error', 3],

  curly: 'error',
  'prettier/prettier': 'error',
};

const typedTsRules: Linter.RulesRecord = {
  'import-x/no-namespace': 'error',
  'import-x/no-cycle': 'error',
  'import-x/no-self-import': 'error',
  'import-x/no-useless-path-segments': 'error',
  'import-x/no-named-as-default': 'error',
  '@typescript-eslint/await-thenable': 'error',
  '@typescript-eslint/no-unsafe-assignment': 'error',
  '@typescript-eslint/no-unsafe-return': 'error',
  '@typescript-eslint/no-unsafe-member-access': 'error',
  '@typescript-eslint/no-unsafe-argument': 'error',
  '@typescript-eslint/no-unsafe-call': 'error',
  '@typescript-eslint/no-deprecated': 'error',
  '@typescript-eslint/consistent-return': 'error',
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/require-await': 'error',
  '@typescript-eslint/explicit-function-return-type': [
    'error',
    {
      allowExpressions: true,
      allowTypedFunctionExpressions: true,
      allowHigherOrderFunctions: true,
      allowDirectConstAssertionInArrowFunctions: true,
    },
  ],
};

const testRules: Linter.RulesRecord = {
  // Allow 'as' type assertions in test files
  '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'as' }],
  'max-lines': ['error', 1000],
  'max-lines-per-function': ['error', 500],
  'max-statements': ['error', 50],
  'max-depth': ['error', 5],
  'no-console': 'off',
};

/* -------------------------------------------------------------------------- */
/* Export                                                                     */
/* -------------------------------------------------------------------------- */

export default defineConfig(
  { ignores: baseIgnores },

  // @ts-expect-error temporary type gap between ESLint 9 and TS-ESLint 8
  ...baseConfig,

  { languageOptions: baseLanguageOptions, rules: baseRules },

  // Untyped checks everywhere
  ...tsUntypedPresets,
  { files: ['**/*.{ts,tsx,mts,cts}'], rules: untypedTsRules },

  // Test file relaxations
  { files: testGlobs, rules: testRules },

  // Scripts / configs / CLI / logger / generated
  {
    files: ['**/*.config.{ts,js}', 'scripts/**/*.{ts,js,mts,mjs}'],
    rules: { 'no-console': 'off' },
  },
  { files: ['**/cli.{ts,js,cjs}'], rules: { 'no-console': 'off' } },
  { files: ['**/logger.{ts,js}', '**/utils/logger.ts'], rules: { 'no-console': 'off' } },
  { files: ['**/generated/**'], rules: { curly: 'off' } },

  // Typed checks only for src/**
  {
    files: ['src/**/*.{ts,tsx,mts,cts}'],
    ignores: [...testGlobs, '**/*.d.ts', '**/dist/**', '**/generated/**', '**/node_modules/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { projectService: true, tsconfigRootDir: baseDir },
    },
    rules: typedTsRules,
  },
);
