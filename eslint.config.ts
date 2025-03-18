// Library for dealing with legacy eslint config
import { FlatCompat } from "@eslint/eslintrc";

import globals from "globals";
import eslint from "@eslint/js";
import type { Linter } from "eslint";
import tseslint from "typescript-eslint";
import type { Config as TSConfig } from "typescript-eslint";

import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import-x";

type ESLintRulesRecord = Linter.RulesRecord;

// Create a compatibility instance - ONLY for Next.js plugin
const compat = new FlatCompat({
  baseDirectory: import.meta.url,
});

// Import rules configuration - enhanced for eslint-plugin-import-x
const importRules: Partial<ESLintRulesRecord> = {
  // Static analysis
  "import/no-unresolved": ["error"], // Ensure imports point to a file/module that can be resolved
  "import/named": ["error"], // Ensure named imports correspond to named exports
  "import/default": ["error"], // Ensure default import matches with the exported default
  "import/namespace": ["error"], // Ensure imported namespaces contain the properties being used
  "import/no-absolute-path": ["error"], // Forbid import of modules using absolute paths
  "import/no-dynamic-require": ["error"], // Forbid require() calls with expressions
  "import/no-relative-packages": ["error"], // Forbid importing packages through relative paths

  // Helpful warnings
  "import/export": ["error"], // Report any invalid exports, i.e., re-export of the same name
  "import/no-named-as-default": ["off"], // Allow imported names as the default export (turned off as in original)
  "import/no-named-as-default-member": ["error"], // Warn on accessing default export as property of the default
  "import/no-deprecated": ["warn"], // Warn on importing deprecated modules
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

// TypeScript rules - Enhanced for better type safety
const tsRules: Partial<ESLintRulesRecord> = {
  "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
  "@typescript-eslint/no-explicit-any": ["error"],
  // Add rules that are actually available in the current version
  "@typescript-eslint/consistent-type-definitions": ["error", "interface"], // Enforce consistent type definition style
  "@typescript-eslint/naming-convention": [
    "warn",
    { selector: "typeProperty", format: ["camelCase"] },
  ],
};

// React rules
const reactRules: Partial<ESLintRulesRecord> = {
  "react/self-closing-comp": ["error", { component: true, html: true }],
  "react-hooks/rules-of-hooks": ["error"],
  "react-hooks/exhaustive-deps": ["error"],
};

export default tseslint.config(
  // Ignore patterns (migrated from .eslintignore)
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

  // Base configuration for all files
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
  },

  // JavaScript files configuration
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      importPlugin,
      reactPlugin,
      reactHooksPlugin,
    },
    rules: {
      ...importRules,
      ...reactRules,
    },
  },

  // TypeScript specific configuration - Enhanced for better typed-components support
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      importPlugin,
      reactPlugin,
      reactHooksPlugin,
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
    rules: {
      ...importRules,
      ...tsRules,
      ...reactRules,
    },
  },

  // Special configuration for styled-components tests
  {
    files: ["**/styles/**/*.test.{ts,tsx}", "**/styles/utils/**/*.{ts,tsx}"],
    rules: {
      // We can't use ban-type-literals as it doesn't exist - removed
      // Instead, disable rules that might be too strict for styled-components tests
      "@typescript-eslint/no-explicit-any": "off", // Allow any in tests
    },
  },

  // Test files configuration
  {
    files: ["**/*.test.{js,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // .github directory files - include these (from the .eslintignore !.github line)
  {
    files: [".github/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  },

  // The main config.
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
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      // ...
    },
  },
  tseslint.configs.recommended,
  compat.config({
    extends: ["next", "next/core-web-vitals", "next/typescript", "prettier"],
  }),
);
