const github = require("@actions/github");

/**
 * Enum for GitHub deployment status states.
 * @readonly
 * @enum {string}
 */
const DEPLOYMENT_STATES = {
  error: "error",
  failure: "failure",
  inactive: "inactive",
  in_progress: "in_progress",
  queued: "queued",
  pending: "pending",
  success: "success",
};

/**
 * @typedef {("preview" | "branch" | "production")} DeploymentEnvironmentTypes
 */
/**
 * Options for the createDeployment GH call.
 * @typedef {Object} CreateDeploymentOptions
 * @property {string} owner
 * @property {string} repo
 * @property {string} ref
 * @property {DeploymentEnvironmentTypes} environment
 * @property {string} description
 * @property {boolean} [transient_environment=true]
 * @property {boolean} [production_environment=false]
 */
/**
 * Create a GitHub deployment event.
 * @param {string} token GitHub PAC with repo permissions.
 * @param {CreateDeploymentOptions} options
 * @returns result of the GitHub API call
 */
const createDeployment = async (token, options) => {
  const {
    owner,
    repo,
    ref,
    environment,
    description,
    transient_environment = true,
    production_environment = false,
  } = options;
  const octokit = github.getOctokit(token);

  return octokit.rest.repos.createDeployment({
    owner,
    repo,
    ref,
    environment,
    auto_merge: false,
    required_contexts: [],
    description,
    transient_environment,
    production_environment,
  });
};

/**
 * Options for the updateDeployment GH call.
 * @typedef {Object} UpdateDeploymentOptions
 * @property {string} owner
 * @property {string} repo
 * @property {string} deploymentId
 * @property {DEPLOYMENT_STATES} state
 * @property {string} [deploymentUrl=""]
 * @property {string} [logUrl=""]
 */
/**
 * Given a GitHub deployment, create a GitHub deployment status event.
 * @param {string} token GitHub PAC with repo permissions.
 * @param {UpdateDeploymentOptions} options
 * @returns result of the GitHub API call
 */
const updateDeployment = async (token, options) => {
  const {
    owner,
    repo,
    deploymentId,
    state,
    deploymentUrl = "",
    logUrl = "",
  } = options;
  const octokit = github.getOctokit(token);

  if (!deploymentId) {
    throw new TypeError(
      `deploymentId must be passed to update a deployment status`
    );
  }
  if (!DEPLOYMENT_STATES[state]) {
    throw new TypeError(
      `Deployment state: "${state}" not supported, allowed values are:\n${Object.values(
        DEPLOYMENT_STATES
      )}`
    );
  }

  return octokit.rest.repos.createDeploymentStatus({
    owner,
    repo,
    deployment_id: deploymentId,
    state,
    description: `Netlify deployment: ${state}`,
    environment_url: deploymentUrl,
    log_url: logUrl,
  });
};

/**
 * Options for the createComment GH call.
 * @typedef {Object} CreateCommentOptions
 * @property {string} owner
 * @property {string} repo
 * @property {string} issue_number
 * @property {string} body
 */
/**
 * Create an issue comments, PRs are a type of issue.
 * @param {string} token GitHub PAC with repo permissions.
 * @param {CreateCommentOptions} options
 * @returns result of the GitHub API call
 */
const createComment = async (token, options) => {
  const { owner, repo, issue_number, body } = options;
  const octokit = github.getOctokit(token);

  if (!issue_number) {
    throw new TypeError(
      `issue_number must be passed to update a deployment status`
    );
  }

  return octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number,
    body,
  });
};

module.exports = {
  createComment,
  createDeployment,
  updateDeployment,
};
