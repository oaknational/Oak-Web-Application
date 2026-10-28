import getBrowserConfig from "@/browser-lib/getBrowserConfig";

function safeUrlParse(url: string, baseUrl?: string) {
  try {
    return new URL(url, baseUrl);
  } catch {
    return null;
  }
}

function addProtocol(url: string) {
  if (url.match(/^(http:\/\/|https:\/\/)/)) {
    return url;
  }
  return `https://${url}`;
}

export function targetFromHref(url: string) {
  const baseUrl = addProtocol(getBrowserConfig("clientAppBaseUrl"));
  const urlObj = safeUrlParse(url, baseUrl);
  if (urlObj && urlObj.hostname !== safeUrlParse(baseUrl)?.hostname) {
    return "_blank";
  }
  return undefined;
}
