const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --base-dir . --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "npm run format:precommit",
    "npx eslint --fix",
    "npm run lint:styles",
  ],
};
