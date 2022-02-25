/**
 * Given the GITHUB_SHA, find the pr and ref it is the head of.
 *
 * Intended for use with Vercel `deployment_status` events which incorrectly
 * set the GITHUB_REF to the commit SHA value.
 */

const core = require("@actions/core");
const github = require("@actions/github");

const prFromSha = require("./pr_from_sha");

async function run() {
  try {
    const githubToken = core.getInput("github_token");

    const octokit = github.getOctokit(githubToken);

    const owner = github.context.payload.repository.owner.login;
    const repo = github.context.payload.repository.name;
    if (!owner || !repo) {
      throw new Error(
        `Could not determine repo details, got: owner "${owner} and repo "${repo}".`
      );
    }

    let sha = github.context.sha;
    if (!sha) {
      throw new Error(`SHA not supplied.`);
    }

    const pullRequest = await prFromSha(octokit, { owner, repo }, sha);
    if (pullRequest === null) {
      core.error(`Could not find pull request for SHA: ${sha}`);
    } else {
      const headRef = pullRequest.head.ref;
      core.info(`Found pull request for for SHA: ${sha} with ref: ${headRef}`);
      core.setOutput("pr_head_ref", headRef);
    }
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
