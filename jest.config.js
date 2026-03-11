// jest.config.js
// See https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = require("./jest.base.config");

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
// From <https://stackoverflow.com/a/72926763>
module.exports = async () => ({
  ...(await createJestConfig(customJestConfig)()),
  transformIgnorePatterns: [
    // As of v5 it no longer ships CJS export, see <https://github.com/portabletext/react-portabletext/blob/main/CHANGELOG.md#500>
    "/node_modules/(?!(@portabletext/react|@portabletext/toolkit)/)",
  ],
});
module.exports.customJestConfig = customJestConfig;
