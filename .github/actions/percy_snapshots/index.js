/**
 * Given a base URL, run some Percy snapshots against it using
 * the Percy CLI.
 */

const core = require("@actions/core");
const exec = require("@actions/exec");

const setEnvVariables = (envVars) => {
  core.debug(`
  Percy run env vars:
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
    const vercelPassword = core.getInput("vercel_password");

    // Get the auth cookie for password protected deployments.
    // https://vercel.com/docs/errors#errors/bypassing-password-protection-programmatically
    let authCookie;
    if (vercelPassword) {
      let authStdOut = "";
      let authStdErr = "";
      const options = {};
      options.listeners = {
        stdout: (data) => {
          authStdOut += data.toString();
        },
        stderr: (data) => {
          authStdErr += data.toString();
        },
      };
      // https://vercel.com/docs/errors#errors/bypassing-password-protection-programmatically
      // eslint-disable-next-line no-useless-escape
      const madCookieParsingCommand = `sh -c cookie=\"$(curl -s -D - -o /dev/null -X POST -d '_vercel_password=${vercelPassword}' ${baseUrl} | grep -i Set-Cookie | grep _vercel_jwt | awk {'print $2'})\"; echo $cookie`;
      await exec.exec(madCookieParsingCommand, undefined, options);

      core.debug(
        `cookie auth std out:\n${JSON.stringify(authStdOut, null, 2)}`
      );
      core.debug(
        `cookie auth std err:\n${JSON.stringify(authStdErr, null, 2)}`
      );

      // TO DO: parse out the cookie value from stdOut.
    }

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
      // Vercel JWT cookie to allow access to password protected sites.
      // Used in percy.config.js
      VERCEL_AUTH_COOKIE: authCookie,
    });

    await exec.exec(
      "npx percy snapshot percy.snapshot.list.js -c percy.config.js "
    );

    // The script ran to completion, a success state for this action
    // will be set. The actual snapshot states will be set by Percy itself.
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
