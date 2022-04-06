/**
 * Given a deployment domain, tell Firebase Auth this domain is allowed.
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
    const domain = core.getInput("domain");
    const credentials = core.getInput("credentials");

    setEnvVariables({
      CREDENTIALS: credentials,
    });

    await exec.exec(`npx firebase_cli --domain  ${domain}`);

    // The script ran to completion, a success state for this action
    // will be set. The actual snapshot states will be set by Percy itself.
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
