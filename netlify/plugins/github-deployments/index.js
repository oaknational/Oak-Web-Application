/**
 *
 * @todo are there published types for these functions?
 */

module.exports = function githubDeploymentPlugin() {
  let somePieceOfData;

  return {
    onPreBuild: ({ packageJson, netlifyConfig }) => {
      console.log("*** onPreBuild ***");
      console.log("** package.json **");
      console.log(packageJson.repository);
      console.log("** Netlify config **");
      console.log(netlifyConfig.build.environment.BRANCH);
      console.log(netlifyConfig.build.environment.CONTEXT);
      console.log(netlifyConfig.build.environment.DEPLOY_PRIME_URL);
      console.log("** process.env **");
      console.log(process.env.HEAD);
      console.log(process.env.COMMIT_REF);
      console.log(process.env.REPOSITORY_URL);
      console.log(process.env.BRANCH);

      // Test inter-hook data passing.
      somePieceOfData = process.env.HEAD;
    },

    onError: () => {
      console.log("*** onError ***");
      console.log("deployment failed");
    },

    onSuccess: () => {
      console.log("*** onSuccess ***");
      console.log("deployment succeeded");
      console.log(`somePieceOfData: ${somePieceOfData}`);
    },
  };
};
