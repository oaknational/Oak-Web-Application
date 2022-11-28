import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config({ path: ".env.test" });

// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  _comment:
    "This config was generated using 'stryker init'. Please take a look at: https://stryker-mutator.io/docs/stryker-js/configuration/ for more information.",
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress"],
  // https://stryker-mutator.io/docs/stryker-js/configuration/#ignorestatic-boolean
  ignoreStatic: true,
  incremental: true,
  testRunner: "jest",
  testRunner_comment:
    "More information about the jest plugin can be found here: https://stryker-mutator.io/docs/stryker-js/jest-runner",
  coverageAnalysis: "perTest",
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",
  ignorePatterns: [
    ".next",
    ".netlify",
    ".github",
    ".storybook",
    "coverage",
    "dist",
    "out",
    "public",
    "e2e_tests",
    "cloudbuild",
  ],
  // Only run test related to node-lib
  commandRunner: { command: "npm run test ./src/node-lib" },
  // Limit scope of mutation test. Just node-lib for now.
  mutate: [
    "src/node-lib/**/*.{j,t}s?(x)",
    // Exclude generated files.
    "!{src,lib}/**/generated/**/*.{j,t}s?(x)",
    // Exclude test files.
    "!{src,lib}/**/__tests__/**/*.{j,t}s?(x)",
    "!{src,lib}/**/?(*.)+(spec|test).{j,t}s?(x)",
    "!{src,lib}/**/*+(Spec|Test).{j,t}s?(x)",
  ],
};
export default config;
