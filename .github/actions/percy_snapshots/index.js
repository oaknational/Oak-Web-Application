/**
 * Given a base URL, run some Percy snapshots against it using
 * the Percy CLI.
 */

const core = require("@actions/core");
const exec = require("@actions/exec");

const setEnvVariables = (envVars) => {
  core.debug(`
  Percy envVars:
  ${JSON.stringify(envVars, null, 2)}
  `);

  for (const [key, value] of Object.entries(envVars)) {
    core.exportVariable(key, value);
  }
};

async function run() {
  try {
    const baseUrl = core.getInput("base_url");
    const branchName = core.getInput("branch_name");
    const prNumber = core.getInput("pr_number");
    const percyToken = core.getInput("percy_token");

    // https://docs.percy.io/docs/environment-variables
    // Presumably the Percy CLI picks up the SHA from the GITHUB_SHA variable.
    setEnvVariables({
      // Used to construct absolute URLs in the snapshot list.
      PERCY_BASE_URL: baseUrl,
      // Need to figure this out because the Vercel deployment events lack a proper `ref`,
      // and Percy needs to know what branch we are comparing to the baseline.
      PERCY_BRANCH: branchName,
      // We should either be in a PR or on the `main` branch.
      // We need the PR info to report the findings back to
      // the right PR UI.
      PERCY_PULL_REQUEST: prNumber || undefined,
      // Should always be main, no need to override.
      // PERCY_TARGET_BRANCH: 'main',
      // The Percy project token.
      PERCY_TOKEN: percyToken,
      // DEBUG logging for Percy
      LOG_LEVEL: "debug",
      PERCY_DEBUG: "*",
    });

    await exec.exec(
      "npx percy snapshot --verbose percy.snapshot.list.js -c percy.config.js ",
    );

    // The script ran to completion, a success state for this action
    // will be set. The actual snapshot states will be set by Percy itself.
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
