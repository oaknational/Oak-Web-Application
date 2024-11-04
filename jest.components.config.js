const nextJest = require("next/jest");

const baseConfig = require("./jest.base.config");

const createJestConfig = nextJest({
  dir: "./",
});

/*
 * To be run with
 *
 *    jest -c ./config/jest.components.config.js ./src/components
 *
 * Which tests only "./src/components" with coverage reported
 */
module.exports = createJestConfig({
  ...baseConfig,
  collectCoverageFrom: [
    "./src/components/**",
    "!./**/*.json",
    "!**/__snapshots__/**",
    "!**/*.config.{js,ts}",
    "!**/*.stories.*",
  ],
});
