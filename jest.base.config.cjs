// Add any custom config to be passed to Jest
module.exports = {
  // increase the default timeout from 5s to 15s, as some tests are slow to run, especially on CI
  testTimeout: 15000,
  collectCoverage: true,
  collectCoverageFrom: [
    "./src/**",
    "!./**/*.json",
    "!src/pages/_document.tsx",
    "!src/styles/themes/types.ts",
    "!e2e_tests/browser/engineering/*",
    "!**/__snapshots__/**",
    "!src/__tests__/__helpers__/*",
    "!**/*.config.{js,ts}",
    "!**/*.stories.*",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "node-lib/sanity-graphql/generated/*",
    "src/storybook-decorators/*",
  ],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/", "src"],
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.mjs"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: [
    "(\\.|/)(fixtures?)\\.[jt]sx?$",
    "src/__tests__/__helpers__/*",
    ".storybook/storybook.*.test.js$",
    ".netlify/*",
    ".yalc/*",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    "^uuid$": require.resolve("uuid"),
    "^@oaknational/oak-components$": require.resolve(
      "@oaknational/oak-components",
    ),
  },
  slowTestThreshold: 2,
};
