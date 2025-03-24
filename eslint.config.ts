/**
 * This is the main eslint config for the project.
 *
 * Plugins we aren't using yet:
 * - sonarjs
 * - unicorn
 */

// Library for dealing with legacy eslint config
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import type { Linter } from "eslint";
import importPlugin from "eslint-plugin-import-x";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

type ESLintRulesRecord = Linter.RulesRecord;

// Create a compatibility instance - ONLY for Next.js plugin
const compat = new FlatCompat({
  baseDirectory: import.meta.url,
});

const ignores = [
  ".next/**",
  "next-env.d.ts",
  "node_modules/**",
  "package-lock.json",
  "public/**",
  "out/**",
  "storybook-static/**",
  "src/node-lib/curriculum-api-2023/generated/**",
  "src/node-lib/sanity-graphql/generated/**",
  "src/**/fixtures/**/*",
  "**/*.fixture.ts",
];

// Import rules configuration - enhanced for eslint-plugin-import-x
const importRules: Partial<ESLintRulesRecord> = {
  // **HIGH PRIORITY FIXES REQUIRED** These may be masking coding errors.
  "import/no-extraneous-dependencies": ["off"], // Forbid importing modules not in package.json, we seem to be using dependency peer dependencies for some components.

  // Rules we can't support yet, as they require a large refactor
  "import/no-named-as-default": ["off"], // Disallow imported names as the default export (turned off as in original)
  "import/no-named-as-default-member": ["off"], // Disallow accessing default export as property of the default
  "import/no-deprecated": ["off"], // Disallow importing deprecated modules
  "import/no-dynamic-require": ["off"], // Forbid require() calls with expressions
  "import/newline-after-import": ["off"], // Enforce newline after imports
  "import/no-anonymous-default-export": ["off"], // Disallow anonymous default exports (have to assign to a variable first)
  "import/no-duplicates": ["off"], // Report repeated import of the same module in multiple places
  "import/named": ["off"], // Ensure named imports correspond to named exports. We need this off because we are mixing variable and type imports, and the type imports are not named. We need to separate variable and type imports.
  // This is the big one, fixing this means changing 1600 ish files.
  "import/order": [
    "off",
    {
      "newlines-between": "always",
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      alphabetize: { order: "asc", caseInsensitive: true },
      warnOnUnassignedImports: true,
    },
  ],

  // Errors
  "import/no-unresolved": ["error"], // Ensure imports point to a file/module that can be resolved
  "import/default": ["error"], // Ensure default import matches with the exported default
  "import/namespace": ["error"], // Ensure imported namespaces contain the properties being used
  "import/no-absolute-path": ["error"], // Forbid import of modules using absolute paths
  "import/no-relative-packages": ["error"], // Forbid importing packages through relative paths
  "import/export": ["error"], // Report any invalid exports, i.e., re-export of the same name
  "import/no-mutable-exports": ["error"], // Forbid exporting mutable variables

  // Style guide
  "import/first": ["error"], // Ensure all imports are first at the top
};

// React rules
const reactRules: Partial<ESLintRulesRecord> = {
  // **HIGH PRIORITY FIXES REQUIRED** These may be masking coding errors or performance issues.
  "react/jsx-key": ["off"],
  "react/display-name": ["off"],

  // Rules that are off for now, but will be enabled in separate PRs.
  "react/no-unescaped-entities": ["off"],
  "react/no-children-prop": ["off"],
  "react/no-unstable-nested-components": ["off"],
  "react/no-array-index-key": ["off"],
  "react/no-unknown-property": ["off"],
  "react/no-unused-vars": ["off"],
  "react/no-unused-prop-types": ["off"],

  // Errors
  "react/self-closing-comp": ["error", { component: true, html: true }],
  "react-hooks/rules-of-hooks": ["error"],
  "react-hooks/exhaustive-deps": ["error"],
};

/**
 * Complexity rules. Don't apply to test files.
 *
 * These are deliberately permissive, we will tighten them up over time.
 */
const complexityRules: Partial<ESLintRulesRecord> = {
  // Rules that are off for now, but will be enabled in separate PRs.
  curly: ["off", "all"], // Enforce consistent braces style for clarity

  // Errors

  // Limit cyclomatic complexity to a reasonable starting point
  complexity: ["error", 70], // 70 for schemas, once that is resolved reduce to 40. We're aiming for 20.

  // Enforce a maximum depth for nested blocks
  "max-depth": ["error", 6], // ./src/browser-lib/hubspot/forms/hubspotSubmitForm.ts, once that is resolved reduce to 5. We're aiming for 4.

  // Limit excessive function parameters
  "max-params": ["error", 7], // ./src/browser-lib/hubspot/forms/hubspotSubmitForm.ts, once that is resolved reduce to 6. We're aiming for 4. Generally prefer to pass objects for multiple parameters.

  // Discourage extremely large files
  "max-lines": ["error", 1500], // 1500 for schemas, once that is resolved reduce to 750. We're aiming for 500-750.
};

/**
 * TypeScript rules
 */
const typescriptRules: Partial<ESLintRulesRecord> = {
  // **HIGH PRIORITY FIXES REQUIRED** Potentially masking coding errors.
  "@typescript-eslint/no-unused-expressions": ["off"],
  "@typescript-eslint/no-unused-vars": ["off", { ignoreRestSiblings: true }],
  "@typescript-eslint/ban-ts-comment": ["off"],

  // Rules that are disabled for now, but will be enabled in separate PRs.
  "@typescript-eslint/no-floating-promises": ["off", { ignoreVoid: true }], // We have some floating promises that are not ignoredVoid
  "@typescript-eslint/no-explicit-any": ["off"],
  "@typescript-eslint/consistent-type-definitions": ["off", "interface"], // Enforce consistent type definition style
  "@typescript-eslint/naming-convention": [
    "off",
    {
      selector: "typeProperty",
      format: ["camelCase", "snake_case", "UPPER_CASE"],
      leadingUnderscore: "allow",
    },
  ],
  "@typescript-eslint/no-misused-promises": ["off"],
  "@typescript-eslint/promise-function-async": "off",
  "@typescript-eslint/consistent-type-imports": [
    "off",
    { prefer: "type-imports" },
  ],
  "@typescript-eslint/no-empty-function": ["off"],
  // Note: you must disable the base JS rule  before using the typescript as it can report incorrect errors
  "prefer-promise-reject-errors": "off", // <--- This is the base JS rule
  "@typescript-eslint/prefer-promise-reject-errors": "off",

  // Errors.
  // We don't have any explicitly enabled ts rules yet.
};

const codeStyleRules: Partial<ESLintRulesRecord> = {
  // Rules that are disabled for now, but will be enabled in separate PRs.
  "no-console": ["off", { allow: ["error", "warn"] }], // Replace console use with logger calls for info, warn, error, debug, etc.
  "no-commented-out-code": ["off"],
  "no-warning-comments": [
    "off",
    {
      terms: [
        "TODO",
        "todo",
        "TO DO",
        "to do",
        "FIXME",
        "fixme",
        "fix me",
        "HACK",
        "hack",
      ],
      location: "anywhere",
    },
  ],
};

export default tseslint.config(
  /**
   * The main config.
   */
  eslint.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  tseslint.configs.recommended,
  compat.config({
    extends: ["next", "next/core-web-vitals", "next/typescript", "prettier"],
  }),

  /**
   * Ignore patterns (migrated from .eslintignore)
   */
  {
    ignores,
  },

  /**
   * Base configuration for **all files**.
   */
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2020,
    },
    settings: {
      // These settings help eslint-plugin-import-x resolve modules
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".d.ts"], // Added .d.ts
        },
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
      "import/external-module-folders": ["node_modules"],
    },
    plugins: {
      importPlugin,
      reactPlugin,
      reactHooksPlugin,
    },
    rules: {
      ...importRules,
      ...reactRules,
      ...complexityRules,
      ...codeStyleRules,
    },
  },

  /**
   * **JavaScript** file specific configuration.
   */
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
  },

  /**
   * **TypeScript** file specific configuration - Enhanced for better typed-components support
   */
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx", ".d.ts"], // Added .d.ts
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    /**
     * TypeScript rules
     */
    rules: {
      ...typescriptRules,
    },
  },

  /**
   * **Test** files configuration.
   */
  {
    files: ["**/*.test.{js,ts,tsx}", "**/__tests__/**/*.{js,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      // Rules that will likely stay disabled for test files.
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/no-require-imports": ["off"],
      "@typescript-eslint/no-empty-function": ["off"],
      "@typescript-eslint/no-var-requires": ["off"],

      // Errors
      "max-lines": ["error", 2000],
    },
  },

  /**
   * **GitHub** directory files
   */
  {
    files: [".github/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  },
);
