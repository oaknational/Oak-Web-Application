// jest.config.js
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  collectCoverage: true,
  collectCoverageFrom: [
    "./src/**",
    "!**/__snapshots__/**",
    "!src/pages/_document.tsx",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "browser-lib/graphql/generated/*",
    "node-lib/graphql/generated/*",
  ],
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["src/__tests__/__helpers__/*"],
  // Custom resolver needed because of firebase exports. See: https://github.com/firebase/firebase-admin-node/issues/1465
  resolver: "jest-node-exports-resolver",
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
