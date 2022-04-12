const { existsSync, readFileSync } = require("fs");

const { version: packageJsonVersion } = require("../../package.json");

/**
 * Attempt to read the SHA of the current Git HEAD from the local file system.
 *
 * @returns {(string|null)} The SHA or `null` if it cannot be determined.
 */
function getLocalGitRef() {
  try {
    if (existsSync(".git")) {
      const rev = readFileSync(".git/HEAD")
        .toString()
        .trim()
        .split(/.*[: ]/)
        .slice(-1)[0];
      if (rev.indexOf("/") === -1) {
        return rev;
      } else {
        return readFileSync(`.git/${rev}`).toString().trim();
      }
    }
  } catch (error) {
    console.error(error);
    console.log(
      "The above error was caught in getLocalGitRef().\nIf this you are seeing this mid-merge or mid-rebase, then likely it is not of concern."
    );
  }
  console.warn("Could not determine local Git ref.");
  return null;
}
/**
 * Figure out the Git ref for non-production builds.
 *
 * Tries common env variables first, then falls back
 * to the local file system .git folder.
 *
 * @returns {(string|null)} A git ref, usually a commit SHA, potentially a tag name.
 */
function getGitRef() {
  const gitRef =
    // Vercel
    process.env.VERCEL_GIT_COMMIT_SHA ||
    // Github Workflow
    process.env.GITHUB_SHA ||
    // GCP Build
    process.env.COMMIT_SHA ||
    process.env.TAG_NAME ||
    // Override
    process.env.GIT_SHA_OVERRIDE;

  if (gitRef) {
    return gitRef;
  } else {
    // Fall back to local Git folder.
    return getLocalGitRef();
  }
}

/**
 * Determine an app version.
 *
 * For production builds use the version from the package.json file.
 * For all other builds use the current Git HEAD SHA.
 *
 * @param {Boolean} isProductionBuild Is this a production build?
 * @returns {string} An app version identifier.
 * @throws {Error} Throws if a Git ref cannot be determined for a non-production build.
 */
function getAppVersion(isProductionBuild) {
  if (isProductionBuild) {
    return `v${packageJsonVersion}`;
  } else {
    const gitRef = getGitRef();
    if (!gitRef) {
      throw new Error(
        "Could not determine a Git ref for this non-production build."
      );
    }
    return gitRef;
  }
}

const RELEASE_STAGE_DEVELOPMENT = "development";
const RELEASE_STAGE_PREVIEW = "preview";
const RELEASE_STAGE_PRODUCTION = "production";
const RELEASE_STAGE_NOT_DEFINED = "NOT_DEFINED";
/**
 * Given a proposed release stage name, return one of the standard release stage names.
 *
 * "development", "preview" or "production".
 * Release stage is elective, so it's different from NODE_ENV and the Webpack `dev` flag.
 *
 * @param {string} candidateReleaseStage the proposed release stage name.
 * @returns {string} The canonical release stage name.
 */
function getReleaseStage(candidateReleaseStage = RELEASE_STAGE_NOT_DEFINED) {
  switch (candidateReleaseStage) {
    case RELEASE_STAGE_DEVELOPMENT:
      return RELEASE_STAGE_DEVELOPMENT;
    case RELEASE_STAGE_PREVIEW:
      return RELEASE_STAGE_PREVIEW;
    case RELEASE_STAGE_PRODUCTION:
      return RELEASE_STAGE_PRODUCTION;
    case RELEASE_STAGE_NOT_DEFINED:
      console.log('No release stage defined, falling back to "development"');
      return RELEASE_STAGE_DEVELOPMENT;
    default:
      throw new TypeError(`
      Unsupported release stage: "${candidateReleaseStage}".
      Available stages are: ${RELEASE_STAGE_DEVELOPMENT}, ${RELEASE_STAGE_PREVIEW} and ${RELEASE_STAGE_PRODUCTION}.
      `);
  }
}

module.exports = {
  getAppVersion,
  getReleaseStage,
  RELEASE_STAGE_DEVELOPMENT,
  RELEASE_STAGE_PREVIEW,
  RELEASE_STAGE_PRODUCTION,
};
