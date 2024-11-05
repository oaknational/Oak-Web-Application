const nextJest = require("next/jest");

const baseConfig = require("./jest.base.config");

const createJestConfig = nextJest({
  dir: "./",
});

/*
 * To be run with
 *
 *    jest -c ./config/jest.pages.config.js ./src/pages
 *
 * Which tests only "./src/pages" with coverage reported
 */
module.exports = createJestConfig({
  ...baseConfig,
  collectCoverageFrom: [
    "./src/pages/**",
    "!./**/*.json",
    "!**/__snapshots__/**",
    "!**/*.config.{js,ts}",
    "!**/*.stories.*",
  ],
});
