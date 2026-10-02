// jest.config.js
// See https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
const nextJest = require("next/jest").default;

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = require("./jest.base.config");

// oak-curriculum-schema v2 bundles ESM-only nested dependencies (camelcase-keys,
// camelcase, map-obj, type-fest). Jest must transform the whole package tree.
const esmPackages =
  "@oaknational/oak-curriculum-schema|camelcase-keys|camelcase|map-obj|type-fest|quick-lru|zod-to-camel-case";
const esmPackagesPnpm = String.raw`@oaknational\+oak-curriculum-schema|camelcase-keys|camelcase|map-obj|type-fest|quick-lru|zod-to-camel-case`;
const esmPackagesPnpmPaths = String.raw`@oaknational[\\/]oak-curriculum-schema|camelcase-keys|camelcase|map-obj|type-fest|quick-lru|zod-to-camel-case`;

const jestConfig = createJestConfig(customJestConfig);

module.exports = async function createPatchedJestConfig() {
  const config = await jestConfig();
  config.transformIgnorePatterns = (config.transformIgnorePatterns ?? []).map(
    (pattern) => {
      if (pattern.includes(String.raw`\.pnpm`)) {
        return pattern
          .replace("|geist|", `|${esmPackagesPnpm}|`)
          .replace("|geist|", `|${esmPackagesPnpmPaths}|`);
      }

      return pattern.replace("|geist|", `|${esmPackages}|`);
    },
  );
  return config;
};
module.exports.customJestConfig = customJestConfig;
