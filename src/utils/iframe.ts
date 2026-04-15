export const isInIframe = () => {
  try {
    return globalThis.self !== globalThis.top;
  } catch {
    return true;
  }
};
