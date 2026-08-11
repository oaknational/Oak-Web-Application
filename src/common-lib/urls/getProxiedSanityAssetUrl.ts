import { tryGetAssetPath } from "@sanity/asset-utils";

import getBrowserConfig from "../../browser-lib/getBrowserConfig";

export const normaliseSanityAssetCDNHost = (host: string) =>
  host.replace(/^https?:\/\//i, "").replace(/\/+$/, "");

/**
 *
 * @param url
 * @returns {string} The url with proxied cdn as host, or if url not sanity
 * asset url, returns the url unmodified.
 */
function getProxiedSanityAssetUrl(url: null): null;
function getProxiedSanityAssetUrl(url: undefined): undefined;
function getProxiedSanityAssetUrl(url: string): string;
function getProxiedSanityAssetUrl(
  url: string | null | undefined,
): string | null | undefined;
function getProxiedSanityAssetUrl(url: string | null | undefined) {
  const assetPath = url ? tryGetAssetPath(url) : null;

  if (!assetPath) {
    return url;
  }

  const assetCDNHost = normaliseSanityAssetCDNHost(
    getBrowserConfig("sanityAssetCDNHost"),
  );

  return `https://${assetCDNHost}/${assetPath}`;
}

export default getProxiedSanityAssetUrl;
