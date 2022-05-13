/**
 * @description Takes a secret name as given on creation of the secret
 * and returns the full name, including the path at which it is stored.
 * @param {string} projectId
 * @param {string} secretName
 */
const getFullSecretName = (projectId, secretName) =>
  `projects/${projectId}/secrets/${secretName}`;

module.exports = {
  getFullSecretName,
};
