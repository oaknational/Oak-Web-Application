const { execSync } = require("child_process");

/**
 * Cancel production builds unless the commit message matches a pattern
 * (non-production builds should always continue).
 *
 * This is because we use the semantic-release package to update the
 * version number in the package.json file, create a commit, then create
 * a Github release for that commit. So every merged PR will trigger two
 * Netlify builds, the first for the merge commit, the second for the
 * semantic-release commit, and we only want to build the semantic-release
 * commit.
 *
 * We require the version number at build time for reporting to tools
 * such as Bugsnag.
 *
 * https://docs.netlify.com/configure-builds/ignore-builds/
 */

const CANCEL_BUILD_EXIT_CODE = 0;
const CONTINUE_BUILD_EXIT_CODE = 1;

function cancelBuild(err) {
  if (err) {
    console.error(err.message);
    console.error("Error, cancelling build");
  }
  process.exit(CANCEL_BUILD_EXIT_CODE);
}
function continueBuild() {
  process.exit(CONTINUE_BUILD_EXIT_CODE);
}

const ref = process.env.BRANCH;
if (!ref) {
  const err = new TypeError("BRANCH was not defined, exiting.");
  cancelBuild(err);
}
console.log(`ref: ${ref}`);
const isMain = ref === "main";
console.log(`isMain: ${isMain}`);

const commitRef = process.env.COMMIT_REF;
const commitRegex = /^([a-zA-Z0-9]){8,}$/;
if (!commitRegex.test(commitRef)) {
  throw new TypeError(`Invalid exec input: ${commitRef}`);
}
const netlifyCommitLog = execSync(
  `git show --no-patch --oneline ${commitRef}`,
  { encoding: "utf8" },
);
if (!netlifyCommitLog) {
  const err = new TypeError("Could not determine commit message");
  cancelBuild(err);
}
console.log(`commit log: ${netlifyCommitLog}`);

// Release commit format defined in release.config.js
const releaseCommitFormat = /build\(release [vV]\d+\.\d+\.\d+\):/;
const isReleaseCommit = releaseCommitFormat.test(netlifyCommitLog);
console.log(`isReleaseCommit: ${isReleaseCommit}`);

// Cancel `main` branch builds that aren't release commits.
const shouldCancel = isMain && !isReleaseCommit;
console.log(`should cancel: ${shouldCancel}`);

if (shouldCancel) {
  cancelBuild();
} else {
  continueBuild();
}
