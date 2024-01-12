// jest.config.js
// See https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
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
    "src/components/ArchivedComponents/*",
  ],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/", "src"],
  // Add more setup options before each test is run
  setupFiles: ["./jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  // Force JSDOM to use the node (or default) export condition, which is the correct behavior for using msw. See https://mswjs.io/docs/migrations/1.x-to-2.x/#cannot-find-module-mswnode-jsdom
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  testPathIgnorePatterns: [
    "(\\.|/)(fixtures?)\\.[jt]sx?$",
    "src/__tests__/__helpers__/*",
    ".storybook/storybook.*.test.js$",
    ".netlify/*",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    "^uuid$": require.resolve("uuid"),
    "^@oak-academy/oak-components$": require.resolve(
      "@oak-academy/oak-components",
    ),
  },
  slowTestThreshold: 2,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
