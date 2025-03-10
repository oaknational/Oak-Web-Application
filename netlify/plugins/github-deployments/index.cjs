const { getIsPluginDisabled } = require("../lib.cjs");

const { createDeployment, updateDeployment } = require("./actions.cjs");

function validateSuccessCode(statusCode) {
  if (statusCode < 200 || statusCode > 299) {
    throw new Error(`GitHub API response error, code: ${statusCode}`);
  }
}

/**
 * Enum for Netlify deploy context values.
 * @readonly
 * @enum {string}
 */
const DEPLOY_CONTEXTS = {
  production: "production",
  deployPreview: "deploy-preview",
  branchDeploy: "branch-deploy",
  dev: "dev",
  cache_busting: "not a deploy context",
};

/**
 * We need to disable plugins for some custom builds.
 */
const isDisabled = getIsPluginDisabled("PLUGIN_GITHUB_DEPLOYMENTS_DISABLED");

module.exports = function githubDeploymentPlugin() {
  let deploymentInfo = {};

  return {
    onPreBuild: async ({ netlifyConfig, utils }) => {
      if (isDisabled) {
        return;
      }

      // Extract the data required to interact with the GitHub deployments rest API.
      const buildContext = netlifyConfig.build.environment.CONTEXT;
      const originalDeploymentUrl = process.env.DEPLOY_PRIME_URL;
      const defaultProductionUrl = process.env.URL;
      // E.g. in case you have a non-public version of the production site for some reason.
      const overrideProductionUrl = process.env.OVERRIDE_PRODUCTION_URL;
      const headBranchRef = process.env.HEAD;
      const sha = process.env.COMMIT_REF;
      const repoUrlString = process.env.REPOSITORY_URL;
      const infoUrl = `https://app.netlify.com/sites/${process.env.SITE_NAME}/deploys/${process.env.DEPLOY_ID}`;
      // For PR (preview) builds only.
      // const prMergeHead = process.env.BRANCH;

      // An optional string to distinguish this deployment environment.
      const deploymentIdentifier = process.env.DEPLOYMENT_IDENTIFIER;

      // Get the environment type from the build context,
      // override naming of preview deployments.
      const isProduction = buildContext === DEPLOY_CONTEXTS.production;
      let environmentType = buildContext;
      if (environmentType === DEPLOY_CONTEXTS.deployPreview) {
        environmentType = "deploy-preview";
      }

      // Modify the deployment URL so that CI tools using it can go straight
      // to the URL on our TLD without hitting the edge function redirect.
      // It's a bit fragile, but otherwise access token headers can get lost
      // in the redirect.
      let deploymentUrl;
      if (isProduction) {
        // If it's production, use the default website URL as the URL.
        deploymentUrl = overrideProductionUrl || defaultProductionUrl;
      } else {
        // Else use the branch or preview URL.
        deploymentUrl = originalDeploymentUrl.replace(
          "netlify.app",
          "netlify.thenational.academy",
        );
      }
      if (!deploymentUrl) {
        throw new Error("Could not determine deployment URL for this build.");
      }

      // For now use a personal access token, but really this should be done with a GitHub App.
      // This is the only user input, but it needs to be secure.
      const githubToken = process.env.GITHUB_DEPLOYMENT_TOKEN;
      if (!githubToken) {
        throw new TypeError(
          "Please supply a GitHub access token in GITHUB_DEPLOYMENT_TOKEN",
        );
      }

      // Store the deployment data for use in subsequent build steps.
      deploymentInfo = {
        buildContext,
        deploymentUrl,
        headBranchRef,
        sha,
        repoUrlString,
        infoUrl,
        githubToken,
        deploymentIdentifier,
      };

      // Get owner, repo
      // https://github.com/oaknational/Oak-Web-Application
      const repoUrl = new URL(repoUrlString);
      const repoPath = repoUrl.pathname;
      // Old school!
      const [owner, repo] = repoPath.slice(1).split("/");
      deploymentInfo.owner = owner;
      deploymentInfo.repo = repo;

      // Get PR number (only used in creating comments).
      // const prNumber = prMergeHead.split("/")[1];

      // Add the branch to non-production environments to enable the
      // transient_environment property to correctly distinguish
      // transient preview and branch deployments.
      if (!isProduction) {
        environmentType = `${environmentType} (${headBranchRef})`;
      }
      const deploymentDescription = `${
        deploymentIdentifier ? deploymentIdentifier : "owa"
      } - ${environmentType}`;
      const environment = deploymentIdentifier
        ? `${deploymentIdentifier} - ${environmentType}`
        : environmentType;

      /** @type {import('./actions').CreateDeploymentOptions} */
      const options = {
        owner,
        repo,
        branchName: headBranchRef,
        // Pass the branch as the ref,
        // assume we will always reference branch or preview deployments rather than commit deployments.
        ref: headBranchRef,
        environment,
        description: deploymentDescription,
        transient_environment: !isProduction,
        production_environment: isProduction,
      };

      let createDeploymentResponse;
      try {
        const result = await createDeployment(githubToken, options);
        validateSuccessCode(result.status);
        createDeploymentResponse = result.data;
      } catch (error) {
        utils.build.failBuild("Failed to create deployment", { error });
      }
      deploymentInfo.deploymentId = createDeploymentResponse.id;

      // Set the deployment status to pending
      /** @type {import('./actions').UpdateDeploymentOptions} */
      const updateOptions = {
        owner: deploymentInfo.owner,
        repo: deploymentInfo.repo,
        deploymentId: deploymentInfo.deploymentId,
        state: "pending",
        logUrl: deploymentInfo.infoUrl,
      };

      try {
        const result = await updateDeployment(githubToken, updateOptions);
        validateSuccessCode(result.status);
      } catch (error) {
        utils.build.failBuild("Failed to update deployment on pending", {
          error,
        });
      }
    },

    /**
     * Set deployment status failure.
     */
    onError: async ({ utils }) => {
      if (isDisabled) {
        return;
      }

      const githubToken = deploymentInfo.githubToken;

      /** @type {import('./actions').UpdateDeploymentOptions} */
      const options = {
        owner: deploymentInfo.owner,
        repo: deploymentInfo.repo,
        deploymentId: deploymentInfo.deploymentId,
        state: "error",
        logUrl: deploymentInfo.infoUrl,
      };

      try {
        const result = await updateDeployment(githubToken, options);
        validateSuccessCode(result.status);
      } catch (error) {
        utils.build.failBuild("Failed to update deployment on error", {
          error,
        });
      }
    },

    /**
     * Set deployment status success.
     */
    onSuccess: async ({ utils }) => {
      if (isDisabled) {
        return;
      }

      const githubToken = deploymentInfo.githubToken;

      /** @type {import('./actions').UpdateDeploymentOptions} */
      const options = {
        owner: deploymentInfo.owner,
        repo: deploymentInfo.repo,
        deploymentId: deploymentInfo.deploymentId,
        state: "success",
        deploymentUrl: deploymentInfo.deploymentUrl,
        logUrl: deploymentInfo.infoUrl,
      };

      try {
        const result = await updateDeployment(githubToken, options);
        validateSuccessCode(result.status);
      } catch (error) {
        utils.build.failBuild("Failed to update deployment on success", {
          error,
        });
      }
    },
  };
};
