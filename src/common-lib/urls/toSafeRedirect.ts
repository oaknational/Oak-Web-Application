/**
 * Takes an untrusted URL or path and returns the full URL
 * if it resolves to something under the provided base URL
 *
 * This is intended to sanitise untrusted redirect URLs
 */
export default function toSafeRedirect(
  untrustedUrl: string,
  safeBaseUrl: URL,
): string | undefined {
  let url: URL;
  try {
    url = new URL(untrustedUrl, safeBaseUrl);
  } catch (_error) {
    return undefined;
  }
  if (url.origin === safeBaseUrl.origin) {
    return url.toString();
  }
  return undefined;
}
