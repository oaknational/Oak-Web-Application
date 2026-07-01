export const getExperimentCookieKey = (flagKey: string) => {
  return `__experiments:${flagKey}`;
};
