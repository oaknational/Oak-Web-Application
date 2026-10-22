// jest.config.js
// See https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = require("./jest.base.config");

// oak-curriculum-schema v2 bundles ESM-only nested dependencies (camelcase-keys,
// camelcase, map-obj, type-fest). jsdom also uses ESM-only HTML/encoding dependencies.
// Jest must transform these dependencies.
const esmPackages =
  "@oaknational/oak-curriculum-schema|camelcase-keys|camelcase|map-obj|type-fest|quick-lru|zod-to-camel-case|@exodus/bytes|parse5|entities|@asamuzakjp/css-color|@asamuzakjp/dom-selector|@csstools/[^/]+|@bramus/specificity|css-tree|tough-cookie";
const esmPackagesPnpm = String.raw`@oaknational\+oak-curriculum-schema|camelcase-keys|camelcase|map-obj|type-fest|quick-lru|zod-to-camel-case|@exodus\+bytes|parse5|entities|@asamuzakjp\+css-color|@asamuzakjp\+dom-selector|@csstools\+[^@/]+|@bramus\+specificity|css-tree|tough-cookie`;

const jestConfig = createJestConfig(customJestConfig);

module.exports = async function createPatchedJestConfig() {
  const config = await jestConfig();
  config.transformIgnorePatterns = config.transformIgnorePatterns.map(
    (pattern) =>
      pattern.replace(
        "geist)",
        `geist|${pattern.includes("/.pnpm/") ? esmPackagesPnpm : esmPackages})`,
      ),
  );
  return config;
};
module.exports.customJestConfig = customJestConfig;
