/**
 * Cancel production builds unless the commit message matches a pattern
 * (non-production builds should always continue).
 *
 * This is because we use the semantic-release package to update the
 * version number in the package.json file, create a commit, then create
 * a Github release for that commit. So every merged PR will trigger two
 * Vercel builds, the first for the merge commit, the second for the
 * semantic-release commit, and we only want to build the semantic-release
 * commit.
 *
 * We require the version number at build time for reporting to tools
 * such as Bugsnag.
 *
 * Use in the Vercel project Git settings "Ignored Build Step" box
 * e.g. `node ./scripts/build/cancel_vercel_build.js`
 * see
 *   * https://vercel.com/docs/concepts/projects/overview#ignored-build-step
 *   * https://vercel.com/support/articles/how-do-i-use-the-ignored-build-step-field-on-vercel
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

const commitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE;
if (!commitMessage) {
  const err = new TypeError(
    "VERCEL_GIT_COMMIT_MESSAGE was not defined, exiting.",
  );
  cancelBuild(err);
}
console.log(`commit message: ${commitMessage}`);

const ref = process.env.VERCEL_GIT_COMMIT_REF;
if (!ref) {
  const err = new TypeError("VERCEL_GIT_COMMIT_REF was not defined, exiting.");
  cancelBuild(err);
}
console.log(`ref: ${ref}`);
const isMain = ref === "main";
console.log(`isMain: ${isMain}`);

// Release commit format defined in release.config.js
const releaseCommitFormat = /^build\(release [vV]\d+\.\d+\.\d+\):/;
const isReleaseCommit = releaseCommitFormat.test(commitMessage);
console.log(`isReleaseCommit: ${isReleaseCommit}`);

// Cancel `main` branch builds that aren't release commits.
const shouldCancel = isMain && !isReleaseCommit;
console.log(`should cancel: ${shouldCancel}`);

if (shouldCancel) {
  cancelBuild();
} else {
  continueBuild();
}
