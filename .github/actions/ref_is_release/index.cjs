/**
 * Given the ref that triggered the action, determine if this is a release tag or not.
 *
 * Used to change the behaviour of the Vercel deployments.
 */

const core = require("@actions/core");
const github = require("@actions/github");

const getIsReleaseTag = require("./is_release_tag.cjs");

async function run() {
  try {
    const ref = github.context.ref;
    if (!ref) {
      throw new Error(`Could not determine ref for action.`);
    }

    const isReleaseTag = getIsReleaseTag(ref);

    core.setOutput("is_release", isReleaseTag.toString());
    core.info(`Ref is_release: ${isReleaseTag}`);
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
