/**
 * Takes a secret name as given on creation of the secret
 * and returns the full name, including the path at which it is stored.
 */
export const getFullSecretName = (projectId: string, secretName: string) =>
  `projects/${projectId}/secrets/${secretName}`;
