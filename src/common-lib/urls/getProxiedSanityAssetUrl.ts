import { tryGetAssetPath } from "@sanity/asset-utils";

import browserConfig from "../../config/browser";

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
  url: string | null | undefined
): string | null | undefined;
function getProxiedSanityAssetUrl(url: string | null | undefined) {
  const assetPath = url ? tryGetAssetPath(url) : null;

  if (!assetPath) {
    return url;
  }

  return `https://${browserConfig.get("sanityAssetCDNHost")}/${assetPath}`;
}

export default getProxiedSanityAssetUrl;
