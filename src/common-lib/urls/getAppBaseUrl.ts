import getBrowserConfig from "@/browser-lib/getBrowserConfig";

/**
 * The origin this deployment is served from: localhost in development, the
 * branch deployment in preview and thenational.academy in production.
 */
export default function getAppBaseUrl(): URL {
  const baseUrl = getBrowserConfig("clientAppBaseUrl");
  console.log({ baseUrl });
  // Not all services prepend the protocol (e.g. VERCEL_BRANCH_URL)
  return new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`);
}
