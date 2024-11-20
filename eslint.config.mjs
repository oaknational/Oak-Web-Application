import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import next from "@next/eslint-plugin-next";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
});

// Common import rules
const importRules = {
  "import/first": "error",
  "import/no-unresolved": "error",
  "import/no-named-as-default": "off",
  "import/order": [
    "error",
    {
      "newlines-between": "always",
      warnOnUnassignedImports: true,
    },
  ],
  "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
};

export default [
  // Base configuration
  {
    ignores: [
      "**/.next",
      "**/next-env.d.ts",
      "**/node_modules",
      "**/package-lock.json",
      "**/public",
      "**/out",
      "**/storybook-static",
      "src/node-lib/curriculum-api-2023/generated",
      "src/node-lib/sanity-graphql/generated",
      "!**/.github",
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: js.environments.node
        ? js.environments.node.globals
        : {
            __dirname: true,
            __filename: true,
            module: true,
            require: true,
            exports: true,
            process: true,
            Buffer: true,
            global: true,
            console: true,
          },
    },
    plugins: {
      "@next/next": next,
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": typescriptEslint,
      import: importPlugin,
    },
    rules: {
      ...importRules,
      "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
      "react-hooks/exhaustive-deps": "error", // Checks effect dependencies
      "react/self-closing-comp": ["error", { component: true, html: true }],
    },
  },

  // TypeScript-specific configuration
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: "@typescript-eslint/parser",
    },
    rules: {
      ...importRules,
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
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
  },

  // Jest-specific configuration for test files
  {
    files: ["**/*.test.{js,ts,tsx}"],
    languageOptions: {
      globals: {
        ...js.environments.jest.globals,
      },
    },
  },

  // Scripts-specific configuration
  {
    files: ["scripts/build/**/*.{js,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
    },
  },
];
