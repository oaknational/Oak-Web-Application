/**
 * Create a Github commit status with the provided name and conclusion values.
 */

const core = require("@actions/core");
const github = require("@actions/github");

const allowedStates = ["error", "failure", "skipped", "pending", "success"];

async function run() {
  try {
    const description = core.getInput("description");
    const statusValue = core.getInput("state");
    const githubToken = core.getInput("github_token");
    // Defaults to a link to the current job run.
    const target_url =
      core.getInput("target_url") ||
      `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;

    if (!allowedStates.includes(statusValue)) {
      throw new TypeError(`Bad state: ${statusValue}`);
    }

    const octokit = github.getOctokit(githubToken);

    core.info(
      `Creating commit status "${description}" with state "${statusValue}"`,
    );

    const owner = github.context.payload.repository.owner.login;
    const repo = github.context.payload.repository.name;
    if (!owner || !repo) {
      throw new Error(
        `Could not determine repo details, got: owner "${owner} and repo "${repo}".`,
      );
    }

    let sha = github.context.sha;
    const ref = github.context.ref;
    if (!sha && !ref) {
      throw new Error(`Neither SHA nor ref supplied.`);
    }

    // If we are in a pull_request event, then get the SHA from the ref.
    // Pull request events use a detached checkout of the potential merge product,
    // so the SHA of the checkout isn't the SHA we want to set a check status for.
    if (github.context.eventName === "pull_request") {
      sha = github.context.payload.pull_request?.head?.sha;
      if (!sha) {
        throw new TypeError("Could not get sha from pull request event data.");
      }
    }

    // We have a ref but no SHA, get HEAD SHA for ref.
    // This could happen in a manually created deployment event.
    if (!sha) {
      core.info(`Fetching SHA for ref "${ref}"`);
      const refResponse = await octokit.rest.git.getRef({
        owner,
        repo,
        ref: ref.replace(/^refs\//, ""),
      });
      sha = refResponse.data.object.sha;
    }

    const request = {
      owner,
      repo,
      sha,
      state: statusValue,
      target_url,
      description: `${statusValue}`,
      context: `Manual status: ${description}`,
    };

    // // DEBUG
    // Dump the whole context out.
    // core.info(`
    // context:
    // ${JSON.stringify(github.context, null, 2)}
    // `);

    // Debug logging
    core.debug(`Event type: ${github.context.eventName}`);
    core.debug(`owner: ${owner}`);
    core.debug(`repo: ${repo}`);
    core.debug(`sha: ${sha}`);
    core.debug(`ref: ${ref}`);
    core.debug(`target_url: ${target_url}`);
    core.debug(`request: ${JSON.stringify(request, null, 2)}`);

    // Make the request.
    // https://docs.github.com/en/rest/reference/checks#create-a-check-run
    const result = await octokit.rest.repos.createCommitStatus(request);

    // Log the request result in debug mode.
    core.debug(`
    result:
    ${JSON.stringify(result, null, 2)}
    `);
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
