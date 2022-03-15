const path = require("path");

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

// https://github.com/okonet/lint-staged/issues/968#issuecomment-1011403980
const checkTypes = [
  `sh -c "
    git merge HEAD &> /dev/null
    result=$?
    if [ $result -ne 0 ]
    then
        # merging, do nothing
        exit 1
    else
        git stash push --message pre-tsc --keep-index --include-untracked
    fi"`,
  `sh -c "
    git merge HEAD &> /dev/null
    result=$?
    if [ $result -ne 0 ]
    then
        # merging, do nothing
        exit 1
    else
        npx tsc --pretty; STATUS=$?; git stash pop --quiet; exit $STATUS
    fi"`,
];

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, ...checkTypes],
};
