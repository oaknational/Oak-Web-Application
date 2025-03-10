const nextJest = require("next/jest");

/** @type {import('jest').Config} */
// @ts-check
const baseConfig = require("./jest.base.config.cjs");

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
