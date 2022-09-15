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
    onPreBuild: ({ netlifyConfig }) => {
      console.log("*** onPreBuild ***");
      const buildContext = netlifyConfig.build.environment.CONTEXT;
      const deploymentUrl = process.env.DEPLOY_PRIME_URL;
      const ref = process.env.HEAD;
      const sha = process.env.COMMIT_REF;
      const repo = process.env.REPOSITORY_URL;
      const infoUrl = `https://app.netlify.com/sites/${process.env.SITE_NAME}/deploys/${process.env.BUILD_ID}`;

      // For now use a personal access token, but really this should be done with a GitHub App.
      // This is the only user input, but it needs to be secure.
      const githubPat = process.env.GITHUB_TOKEN;

      deploymentInfo = {
        buildContext,
        deploymentUrl,
        ref,
        sha,
        repo,
        infoUrl,
        githubPat,
      };
    },

    /**
     * @todo set deployment status failure.
     */
    onError: () => {
      console.log("*** onError ***");
      console.log("deployment failed");
    },

    /**
     * @todo set deployment status success.
     */
    onSuccess: () => {
      console.log("*** onSuccess ***");
      console.log("deployment succeeded");
      console.log("deploymentInfo", deploymentInfo);
    },
  };
};
