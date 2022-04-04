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

module.exports = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ["@next/next"],
  extends: [
    "eslint:recommended",
    "plugin:@next/next/core-web-vitals",
    "plugin:import/recommended",
    "prettier",
  ],
  rules: {
    ...importRules,
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
  ],
};
