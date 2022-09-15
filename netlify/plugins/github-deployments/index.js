const github = require("@actions/github");

// const createDeployment = async (token, branchName, environment) => {
//   const octokit = github.getOctokit(token);
//   return octokit.rest.repos.createDeployment({
//     owner,
//     repo,
//     ref,
//     environment,
//     auto_merge: false,
//     required_contexts: [],
//     auto_inactive: false,
//     production_environment,
//     description: `branch: ${branchName}`,
//   });
// };

// const updateDeployment = async (token, deployId, state, deploymentUrl) => {
//   const octokit = github.getOctokit(token);
//   return octokit.rest.repos.createDeploymentStatus({
//     owner,
//     repo,
//     deployment_id: deployId,
//     state,
//     environment_url: deploymentUrl,
//     target_url: deploymentUrl,
//   });
// };

const createComment = async (token, { owner, repo, issue_number, body }) => {
  const octokit = github.getOctokit(token);
  octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number,
    body,
  });
};

/**
 *
 * @todo are there published types for these functions?
 */
module.exports = function githubDeploymentPlugin() {
  let deploymentInfo = {};

  return {
    /**
     *
     * @todo create deployment event with deployment status pending.
     * @todo use buildContext to set deployment type.
     */
    onPreBuild: async ({ netlifyConfig }) => {
      console.log("*** onPreBuild ***");
      const buildContext = netlifyConfig.build.environment.CONTEXT;
      const deploymentUrl = process.env.DEPLOY_PRIME_URL;
      const ref = process.env.HEAD;
      const sha = process.env.COMMIT_REF;
      const prMergeHead = process.env.BRANCH;
      const repoUrlString = process.env.REPOSITORY_URL;
      const infoUrl = `https://app.netlify.com/sites/${process.env.SITE_NAME}/deploys/${process.env.BUILD_ID}`;

      // For now use a personal access token, but really this should be done with a GitHub App.
      // This is the only user input, but it needs to be secure.
      const githubToken = process.env.GITHUB_DEPLOYMENT_TOKEN;

      deploymentInfo = {
        buildContext,
        deploymentUrl,
        ref,
        sha,
        repoUrlString,
        infoUrl,
        githubToken,
      };

      // Get owner, repo
      // https://github.com/oaknational/Oak-Web-Application
      const repoUrl = new URL(repoUrlString);
      const repoPath = repoUrl.pathname;
      const [owner, repo] = repoPath.split("/");
      // Get PR number
      const prNumber = prMergeHead.split("/")[1];

      const result = await createComment(githubToken, {
        owner,
        repo,
        issue_number: prNumber,
        body: "hellooo!",
      });

      console.log("result", result);
    },

    /**
     * @todo set deployment status failure.
     */
    onError: async () => {
      console.log("*** onError ***");
      console.log("deployment failed");
    },

    /**
     * @todo set deployment status success.
     */
    onSuccess: async () => {
      console.log("*** onSuccess ***");
      console.log("deployment succeeded");
      console.log("deploymentInfo", deploymentInfo);
    },
  };
};
