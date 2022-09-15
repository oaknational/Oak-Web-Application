/**
 *
 * @todo are there published types for these functions?
 */

module.exports.onPreBuild = function ({ packageJson, netlifyConfig }) {
  console.log("*** onPreBuild ***");
  console.log("packageJson", packageJson);
  console.log("netlifyConfig", netlifyConfig);
  console.log("ENV:", process.env);
};

module.exports.onError = function ({ packageJson, netlifyConfig }) {
  console.log("*** onError ***");
  console.log("packageJson", packageJson);
  console.log("netlifyConfig", netlifyConfig);
  console.log("ENV:", process.env);
};

module.exports.onSuccess = function ({ packageJson, netlifyConfig }) {
  console.log("*** onSuccess ***");
  console.log("packageJson", packageJson);
  console.log("netlifyConfig", netlifyConfig);
  console.log("ENV:", process.env);
};
