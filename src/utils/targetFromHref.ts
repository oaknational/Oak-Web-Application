import getBrowserConfig from "@/browser-lib/getBrowserConfig";

export function targetFromHref(url: string) {
  const baseUrl = getBrowserConfig("clientAppBaseUrl");
  const urlObj = new URL(url, baseUrl);
  if (urlObj && urlObj.hostname !== new URL(baseUrl).hostname) {
    return "_blank";
  }
  return undefined;
}
