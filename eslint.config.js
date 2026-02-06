const { defineConfig, globalIgnores } = require("eslint/config");
const globals = require("globals");
const nextNext = require("@next/eslint-plugin-next");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const { fixupPluginRules, fixupConfigRules } = require("@eslint/compat");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

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

module.exports = defineConfig([
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
      "react-hooks": fixupPluginRules(reactHooks),
    },

    extends: fixupConfigRules(
      compat.extends(
        "eslint:recommended",
        "plugin:@next/next/core-web-vitals",
        "plugin:import/recommended",
        "prettier",
      ),
    ),

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
  {
    files: ["**/*.{ts,tsx}"],

    plugins: {
      "@next/next": fixupPluginRules(nextNext),
    },

    extends: fixupConfigRules(
      compat.extends(
        "plugin:@next/next/core-web-vitals",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier",
      ),
    ),

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
]);
