const { execSync } = require("child_process");
const { existsSync, readFileSync } = require("fs");

/**
 * Attempt to read the SHA of the current Git HEAD from the local file system.
 *
 * @returns {(string|null)} The SHA if found, or "no_git_state" if mid-merge, or `null` if it cannot be determined.
 */
function getLocalGitRef() {
  if (existsSync(".git")) {
    const rev = readFileSync(".git/HEAD")
      .toString()
      .trim()
      .split(/.*[: ]/)
      .slice(-1)[0];
    if (rev.indexOf("/") === -1) {
      return rev;
    } else {
      try {
        return readFileSync(`.git/${rev}`).toString().trim();
      } catch (error) {
        // Likely mid-merge
        return "no_git_state";
      }
    }
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
    process.env.GCP_COMMIT_SHA ||
    process.env.GCP_TAG_NAME ||
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
 * For production builds parse the version from the Git ref triggering the build.
 * For all other builds use the current Git HEAD SHA.
 *
 * @param {Boolean} isProductionBuild Is this a production build?
 * @returns {string} An app version identifier.
 * @throws {Error} Throws if a Git ref cannot be determined for a non-production build.
 */
function getAppVersion(isProductionBuild) {
  if (isProductionBuild) {
    const appVersionOverride = process.env.OVERRIDE_APP_VERSION;
    if (appVersionOverride) {
      return appVersionOverride;
    }

    // GCP get the tag name.
    const gcpTagName = process.env.GCP_TAG_NAME;
    if (gcpTagName) {
      return `${gcpTagName}-static`;
    }

    // Vercel or Netlify, parse the release commit message or log.
    let infoMessage;
    const vercelCommitMessage = process.env.VERCEL_GIT_COMMIT_MESSAGE;
    const netlifyCommitRef = process.env.COMMIT_REF;
    if (vercelCommitMessage) {
      infoMessage = vercelCommitMessage;
    } else if (netlifyCommitRef) {
      const commitRegex = /^([a-zA-Z0-9]){8,}$/;
      if (!commitRegex.test(netlifyCommitRef)) {
        throw new TypeError(`Invalid exec input: ${netlifyCommitRef}`);
      }
      const netlifyCommitLog = execSync(
        `git show --no-patch --oneline ${netlifyCommitRef}`,
        { encoding: "utf8" },
      );
      infoMessage = netlifyCommitLog;
    } else {
      throw new Error("Could not determine build environment");
    }

    // DEBUG
    console.log("infoMessage", infoMessage);

    // Vercel or Netlify
    // Release commit format defined in release.config.js
    const releaseCommitFormat = /build\(release [vV]\d+\.\d+\.\d+\):/;
    const isReleaseCommit = releaseCommitFormat.test(infoMessage);
    if (isReleaseCommit) {
      const matches = infoMessage.match(/([vV]\d+\.\d+\.\d+)/);
      if (matches === null) {
        throw new TypeError(
          "Could not extract app version from commit info message",
        );
      }
      let version = matches[0];

      // Differentiate Vercel and Netlify versions for Bugsnag
      if (process.env.VERCEL) {
        version = `${version}-vercel`;
      }
      return version;
    }

    // Couldn't figure out production version number, bail.
    throw new TypeError("Could not determine production version number.");
  } else {
    const gitRef = getGitRef();
    if (!gitRef) {
      throw new Error(
        "Could not determine a Git ref for this non-production build.",
      );
    }
    return gitRef;
  }
}

const RELEASE_STAGE_TESTING = "test";
const RELEASE_STAGE_DEVELOPMENT = "development";
const RELEASE_STAGE_DEVELOPMENT_NETLIFY = "dev";
const RELEASE_STAGE_BRANCH_DEPLOY_NETLIFY = "branch-deploy";
const RELEASE_STAGE_PREVIEW = "preview";
const RELEASE_STAGE_PREVIEW_NETLIFY = "deploy-preview";
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
    case RELEASE_STAGE_DEVELOPMENT_NETLIFY:
    case RELEASE_STAGE_BRANCH_DEPLOY_NETLIFY:
      return RELEASE_STAGE_DEVELOPMENT;
    case RELEASE_STAGE_PREVIEW:
    case RELEASE_STAGE_PREVIEW_NETLIFY:
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
  RELEASE_STAGE_TESTING,
  RELEASE_STAGE_DEVELOPMENT,
  RELEASE_STAGE_PREVIEW,
  RELEASE_STAGE_PRODUCTION,
};
