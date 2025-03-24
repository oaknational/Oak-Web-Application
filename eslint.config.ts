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

// Import rules configuration - enhanced for eslint-plugin-import-x
const importRules: Partial<ESLintRulesRecord> = {
  // Explicitly disabled rules
  "import/no-named-as-default": ["off"], // Allow imported names as the default export (turned off as in original)
  "import/no-named-as-default-member": ["off"], // Allow accessing default export as property of the default

  // Helpful warnings
  "import/no-deprecated": ["warn"], // Warn on importing deprecated modules

  // Errors
  "import/no-unresolved": ["error"], // Ensure imports point to a file/module that can be resolved
  "import/named": ["error"], // Ensure named imports correspond to named exports
  "import/default": ["error"], // Ensure default import matches with the exported default
  "import/namespace": ["error"], // Ensure imported namespaces contain the properties being used
  "import/no-absolute-path": ["error"], // Forbid import of modules using absolute paths
  "import/no-dynamic-require": ["error"], // Forbid require() calls with expressions
  "import/no-relative-packages": ["error"], // Forbid importing packages through relative paths
  "import/export": ["error"], // Report any invalid exports, i.e., re-export of the same name
  "import/no-extraneous-dependencies": ["error"], // Forbid importing modules not in package.json
  "import/no-mutable-exports": ["error"], // Forbid exporting mutable variables

  // Style guide
  "import/first": ["error"], // Ensure all imports are first at the top
  "import/order": [
    "error",
    {
      "newlines-between": "always",
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      alphabetize: { order: "asc", caseInsensitive: true },
      warnOnUnassignedImports: true,
    },
  ],
  "import/newline-after-import": ["error"], // Enforce newline after imports
  "import/no-duplicates": ["error"], // Report repeated import of the same module in multiple places
};

// React rules
const reactRules: Partial<ESLintRulesRecord> = {
  "react/self-closing-comp": ["error", { component: true, html: true }],
  "react-hooks/rules-of-hooks": ["error"],
  "react-hooks/exhaustive-deps": ["error"],
};

/**
 * Complexity rules. Don't apply to test files.
 *
 * These are deliberately permissive, we can tighten them up over time.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const complexityRules: Partial<ESLintRulesRecord> = {
  // Limit cyclomatic complexity to a reasonable starting point
  complexity: ["error", 21],

  // Enforce a maximum depth for nested blocks
  "max-depth": ["error", 5],

  // Limit excessive function parameters
  "max-params": ["error", 6],

  // Discourage extremely large files
  "max-lines": ["error", 750],

  // Enforce consistent braces style for clarity
  curly: ["error", "all"],
};

export default tseslint.config(
  /**
   * Ignore patterns (migrated from .eslintignore)
   */
  {
    ignores: [
      ".next/**",
      "next-env.d.ts",
      "node_modules/**",
      "package-lock.json",
      "public/**",
      "out/**",
      "storybook-static/**",
      "src/node-lib/curriculum-api-2023/generated/**",
      "src/node-lib/sanity-graphql/generated/**",
    ],
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
      // TODO: Add complexity rules back in once the base issues are resolved, but tweak the levels to allow the current code,
      // and then make the levels stricter over time.
      //...complexityRules,
      // Warnings that will be converted to errors over time
      // "no-console": ["error", { allow: ["error", "warn"] }], // Replace console use with logger calls for info, warn, error, debug, etc.
      // "no-warning-comments": [
      //   "warn",
      //   {
      //     terms: [
      //       "TODO",
      //       "todo",
      //       "TO DO",
      //       "to do",
      //       "FIXME",
      //       "fixme",
      //       "fix me",
      //       "HACK",
      //       "hack",
      //     ],
      //     location: "anywhere",
      //   },
      // ],
      // "no-commented-out-code": ["warn"],
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
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
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
    // Structural rules that directly catch errors.
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true },
      ],
      "@typescript-eslint/no-floating-promises": [
        "error",
        { ignoreVoid: true },
      ],
      // Comment out new rules until we resolve the existing issues.
      // "@typescript-eslint/no-explicit-any": ["error"],
      // "@typescript-eslint/consistent-type-definitions": ["error", "interface"], // Enforce consistent type definition style
      // "@typescript-eslint/naming-convention": [
      //   "warn",
      //   {
      //     selector: "typeProperty",
      //     format: ["camelCase", "snake_case", "UPPER_CASE"],
      //     leadingUnderscore: "allow",
      //   },
      // ],
      // "@typescript-eslint/no-misused-promises": ["error"],
      // "@typescript-eslint/promise-function-async": "error",
      // // Note: you must disable the base rule as it can report incorrect errors
      // "prefer-promise-reject-errors": "off",
      // "@typescript-eslint/prefer-promise-reject-errors": "error",
      // "@typescript-eslint/consistent-type-imports": "error"
    },
  },

  /**
   * **Test** files configuration.
   *
   * Allow type casting.
   */
  {
    files: ["**/*.test.{js,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": ["off"],
    },
  },

  /**
   * **GitHub** directory files
   */
  {
    files: [".github/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  },

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
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  tseslint.configs.recommended,
  compat.config({
    extends: ["next", "next/core-web-vitals", "next/typescript", "prettier"],
  }),
);
