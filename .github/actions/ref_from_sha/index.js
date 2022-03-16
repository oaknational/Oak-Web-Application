/**
 * Given the GITHUB_SHA, find the pr and ref it is the head of.
 *
 * Intended for use with Vercel `deployment_status` events which incorrectly
 * set the GITHUB_REF to the commit SHA value.
 */

const core = require("@actions/core");
const github = require("@actions/github");

const prFromSha = require("./pr_from_sha");
const branchFromSha = require("./branch_from_sha");

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

    // Get the PR that has the given SHA as the head of the feature branch.
    const pullRequest = await prFromSha(octokit, { owner, repo }, sha);
    let headRef;
    if (pullRequest !== null) {
      headRef = pullRequest.head.ref;
    } else {
      // The SHA is not on a branch in a PR, get from first matching branch, prefer `main`.
      const branch = await branchFromSha(octokit, { owner, repo }, sha);
      if (branch !== null) {
        headRef = branch.name;
      } else {
        // No refs to be had.
        core.error(`Could not find pull request or branch for SHA: ${sha}`);
      }
    }

    // TO DO: handle release tags? v1.2.3
    const fullHeadRef = `refs/heads/${headRef}`;
    core.setOutput("pr_head_ref", fullHeadRef);
    core.info(
      `Found pull request for for SHA: ${sha} with ref: ${fullHeadRef}`
    );
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
