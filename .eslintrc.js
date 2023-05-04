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

module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ["@next/next", "react", "react-hooks"],
  extends: [
    "eslint:recommended",
    "plugin:@next/next/core-web-vitals",
    "plugin:import/recommended",
    "prettier",
  ],
  rules: {
    ...importRules,
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "error", // Checks effect dependencies
    "react/self-closing-comp": ["error", { component: true, html: true }],
  },

  // Put the Typescript config in an override, so we can still lint js files.
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      plugins: ["@next/next", "@typescript-eslint"],
      extends: [
        "plugin:@next/next/core-web-vitals",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "prettier",
      ],
      rules: {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-floating-promises": "error",
        ...importRules,
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
    {
      files: ["**/*.test.{js,ts,tsx}"],
      env: {
        jest: true,
      },
    },
    {
      files: ["scripts/build/**/*.{js,ts,tsx}"],
      env: {
        es2020: true,
      },
    },
  ],
};
