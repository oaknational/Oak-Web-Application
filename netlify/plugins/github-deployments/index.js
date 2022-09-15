/**
 *
 * @todo are there published types for these functions?
 */

export const onPreBuild = function ({ packageJson, netlifyConfig }) {
  console.log("*** onPreBuild ***");
  console.log("packageJson", packageJson);
  console.log("netlifyConfig", netlifyConfig);
  console.log("ENV:", process.env);
};

export const onError = function ({ packageJson, netlifyConfig }) {
  console.log("*** onError ***");
  console.log("packageJson", packageJson);
  console.log("netlifyConfig", netlifyConfig);
  console.log("ENV:", process.env);
};

export const onSuccess = function ({ packageJson, netlifyConfig }) {
  console.log("*** onSuccess ***");
  console.log("packageJson", packageJson);
  console.log("netlifyConfig", netlifyConfig);
  console.log("ENV:", process.env);
};
