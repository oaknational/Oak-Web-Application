/**
 * Given a deployment domain, tell Firebase Auth this domain is allowed.
 */

const core = require("@actions/core");

const addAuthorizedDomain = require("./addAuthorizedDomain");

async function run() {
  try {
    const domain = core.getInput("domain");
    const firebaseServiceAccount = core.getInput("firebaseServiceAccount");

    addAuthorizedDomain({ domain, firebaseServiceAccount });

    // The script ran to completion, a success state for this action
    // will be set. The actual snapshot states will be set by Percy itself.
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
