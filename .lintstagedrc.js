const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

// https://github.com/okonet/lint-staged/issues/968#issuecomment-1011403980
const checkTypes = [
  "sh -c 'git stash push --message pre-tsc --keep-index --include-untracked'",
  "sh -c 'npx tsc --pretty; STATUS=$?; git stash pop --quiet; exit $STATUS'",
];

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, ...checkTypes],
};
