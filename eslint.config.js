const { globalIgnores } = require("eslint/config");
const globals = require("globals");
const nextNext = require("@next/eslint-plugin-next");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const importPlugin = require("eslint-plugin-import");
const typescriptPlugin = require("@typescript-eslint/eslint-plugin");
const prettier = require("eslint-config-prettier");
const js = require("@eslint/js");
const browserCompat = require("eslint-plugin-compat");

const typescriptFiles = ["**/*.{ts,tsx}"];
const typescriptRecommended = typescriptPlugin.configs["flat/recommended"];
const typescriptConfigs = Array.isArray(typescriptRecommended)
  ? typescriptRecommended
  : [typescriptRecommended];

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
};

module.exports = [
  nextNext.configs["core-web-vitals"],
  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  prettier,
  browserCompat.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: 2020,
      parserOptions: {},
    },

    plugins: {
      react,
      "react-hooks": reactHooks,
    },

    rules: {
      ...importRules,
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      "react/self-closing-comp": [
        "error",
        {
          component: true,
          html: true,
        },
      ],
    },
  },
  globalIgnores([
    "**/.next",
    "**/.yalc",
    "**/jest.setup.js",
    "**/.storybook",
    "**/scripts",
    "**/next.config.ts",
    "**/next-env.d.ts",
    "**/node_modules",
    "**/package-lock.json",
    "**/public",
    "**/out",
    "**/storybook-static",
    "src/node-lib/curriculum-api-2023/generated",
    "src/node-lib/sanity-graphql/generated",
    "src/node-lib/educator-api/generated",
    "!**/.github",
  ]),
  ...typescriptConfigs.map((config) => ({
    ...config,
    files: typescriptFiles,
  })),
  {
    ...importPlugin.flatConfigs.recommended,
    files: typescriptFiles,
  },
  {
    ...importPlugin.flatConfigs.typescript,
    files: typescriptFiles,
  },
  {
    ...prettier,
    files: typescriptFiles,
  },
  {
    files: typescriptFiles,
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-explicit-any": "error",

      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],

      ...importRules,
    },

    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        // reads tsconfig paths like @/*
        typescript: {
          project: ["./tsconfig.json"],
          alwaysTryTypes: true,
        },
        // lets import/no-unresolved resolve non-TS assets like .svg
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts", ".svg"],
        },
      },
      polyfills: [],
    },
  },
  {
    files: ["**/*.test.{js,ts,tsx}"],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  {
    files: ["scripts/build/**/*.{js,ts,tsx}"],

    languageOptions: {
      globals: {},
    },
  },
  {
    files: ["**/__tests__/**/*", "**/*.{test,spec}.{js,ts,tsx}"],

    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  globalIgnores(["**/temp.js", "config/*"]),
];
