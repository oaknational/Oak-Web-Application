import globals from "globals";
import pluginJs from "@eslint/js";
import * as tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import-x";
import prettierConfig from "eslint-config-prettier";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";

// Get current directory
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Create a compatibility instance - ONLY for Next.js plugin
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Import rules configuration - enhanced for eslint-plugin-import-x
const importRules = {
  // Static analysis
  "import/no-unresolved": "error", // Ensure imports point to a file/module that can be resolved
  "import/named": "error", // Ensure named imports correspond to named exports
  "import/default": "error", // Ensure default import matches with the exported default
  "import/namespace": "error", // Ensure imported namespaces contain the properties being used
  "import/no-absolute-path": "error", // Forbid import of modules using absolute paths
  "import/no-dynamic-require": "error", // Forbid require() calls with expressions
  "import/no-relative-packages": "error", // Forbid importing packages through relative paths

  // Helpful warnings
  "import/export": "error", // Report any invalid exports, i.e., re-export of the same name
  "import/no-named-as-default": "off", // Allow imported names as the default export (turned off as in original)
  "import/no-named-as-default-member": "error", // Warn on accessing default export as property of the default
  "import/no-deprecated": "warn", // Warn on importing deprecated modules
  "import/no-extraneous-dependencies": "error", // Forbid importing modules not in package.json
  "import/no-mutable-exports": "error", // Forbid exporting mutable variables

  // Style guide
  "import/first": "error", // Ensure all imports are first at the top
  "import/order": [
    "error",
    {
      "newlines-between": "always",
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      alphabetize: { order: "asc", caseInsensitive: true },
      warnOnUnassignedImports: true,
    },
  ],
  "import/newline-after-import": "error", // Enforce newline after imports
  "import/no-duplicates": "error", // Report repeated import of the same module in multiple places
};

// TypeScript rules
const tsRules = {
  "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
  "@typescript-eslint/no-explicit-any": "error",
};

// React rules
const reactRules = {
  "react/self-closing-comp": ["error", { component: true, html: true }],
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "error",
};

/** @type {import('eslint').Linter.Config[]} */
export default [
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
          extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
        },
      },
      "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
      "import/external-module-folders": ["node_modules"],
    },
  },

  // Basic ESLint recommended configuration
  pluginJs.configs.recommended,

  // JavaScript files configuration
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: {
      import: importPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    rules: {
      ...importRules,
      ...reactRules,
    },
  },

  // TypeScript specific configuration
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      ...importRules,
      ...tsRules,
      ...reactRules,
    },
  },

  // TypeScript ESLint recommended configuration
  ...tseslint.configs.recommended,

  // Test files configuration
  {
    files: ["**/*.test.{js,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },

  // Build scripts configuration
  {
    files: ["scripts/build/**/*.{js,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
    },
  },

  // .github directory files - include these (from the .eslintignore !.github line)
  {
    files: [".github/**/*.{js,mjs,cjs,jsx,ts,tsx}"],
  },

  // Next.js configuration - using FlatCompat
  ...compat.extends("plugin:@next/next/core-web-vitals"),

  // Prettier (should be last to override other formatting rules)
  prettierConfig,
];
