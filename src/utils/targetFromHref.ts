import getBrowserConfig from "@/browser-lib/getBrowserConfig";

export function targetFromHref(url: string) {
  const baseUrl = getBrowserConfig("clientAppBaseUrl");
  const urlObj = URL.parse(url);
  if (urlObj && !urlObj.hostname.endsWith(new URL(baseUrl).hostname)) {
    return "_blank";
  }
  return undefined;
}
