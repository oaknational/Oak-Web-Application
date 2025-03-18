// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  collectCoverage: false,
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.mjs"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  // We were using this with the Storybook snapshot tests, leaving in for if we want to do e.g. Percy comparisons.
  passWithNoTests: true,
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["src/__tests__/__helpers__/*"],
  testRegex: ".storybook/storybook.*.test.js$",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
