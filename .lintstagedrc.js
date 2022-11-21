const path = require("path");

const buildEslintCommand = (filenames) =>
  // We need the first `--file .` because for some reason `next lint` tries to read the
  // env files at the location of the first specified file, not the directory the
  // command is run in. This results in the Next config process erroring, which
  // break linting, which prevents commits passing their Husky checks.
  `next lint --fix --file . --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, "npm run lint:styles"],
};
