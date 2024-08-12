const { writeFileSync } = require("node:fs");

module.exports = function deploymentBaseUrl() {
  return {
    onPreBuild: ({ inputs }) => {
      const DEPLOY_BASE_URL = (() => {
        switch (process.env.CONTEXT) {
          case "deploy-preview":
            // Deploy previews are fronted by Cloudflare on a thenational.academy sub-domain.
            return process.env.DEPLOY_PRIME_URL.replace(
              /\.app$/,
              ".thenational.academy",
            );
          default:
            return process.env.URL;
        }
      })();
      writeFileSync(inputs.config_path, JSON.stringify({ DEPLOY_BASE_URL }));
    },
  };
};
