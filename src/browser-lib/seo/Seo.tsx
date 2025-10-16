import React, { FC } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import { SOCIAL_SHARING_IMAGE_URL } from "../../image-data";
import getBrowserConfig from "../getBrowserConfig";

export const DEFAULT_SEO_PROPS = {
  title: getBrowserConfig("seoAppName"),
  description: getBrowserConfig("seoAppDescription"),
};

export const BETA_SEO_PROPS = {
  title: getBrowserConfig("seoAppName"),
  description: getBrowserConfig("seoAppDescription"),
  noIndex: true,
  noFollow: true,
};

export type SeoProps = {
  title: string;
  description: string;
  canonicalURL?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  imageUrl?: string;
};

/**
 * Oak Seo component. A wrapper round NextSeo with sensible defaults.
 * @see [seo.md](../../../docs/seo.md)
 */
const Seo: FC<SeoProps> = ({
  title,
  description,
  imageUrl = SOCIAL_SHARING_IMAGE_URL,
  noIndex = false,
  noFollow = false,
  canonicalURL,
}) => {
  const router = useRouter();

  // Strip sid query parameters from canonical URL to point to clean version
  function stripSidParams(url?: string | null): string | undefined {
    if (!url) {
      return url ?? undefined;
    }

    const [beforeHash = url, hashFragment] = url.split("#");
    const [basePath = beforeHash, queryString] = beforeHash.split("?");

    if (!queryString) {
      return url;
    }

    const params = new URLSearchParams(queryString);
    const entries = Array.from(params.entries());

    const cleanedParams = new URLSearchParams();
    let hasChanges = false;

    for (const [key, value] of entries) {
      // Strip sid, sm, and src parameters
      if (key.startsWith("sid") || key === "sm" || key === "src") {
        hasChanges = true;
        continue;
      }

      cleanedParams.append(key, value);
    }

    if (!hasChanges) {
      return url;
    }

    const normalisedBasePath = basePath.replace(/\/$/, "");
    const cleanedQuery = cleanedParams.toString();
    const rebuilt = cleanedQuery
      ? `${normalisedBasePath}?${cleanedQuery}`
      : normalisedBasePath;

    return hashFragment ? `${rebuilt}#${hashFragment}` : rebuilt;
  }

  const seoAppUrl = getBrowserConfig("seoAppUrl");
  const baseSeoUrl =
    typeof seoAppUrl === "string" && seoAppUrl ? seoAppUrl : "";

  // Build canonical URL from router.asPath or provided canonicalURL
  const rawCanonicalURL = canonicalURL ?? `${baseSeoUrl}${router.asPath}`;

  // Strip sid params and trim trailing slashes
  const canonicalWithoutSid = stripSidParams(rawCanonicalURL);
  const formattedCanonicalURL = canonicalWithoutSid
    ? canonicalWithoutSid.replace(/\/$/, "")
    : canonicalWithoutSid;

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={formattedCanonicalURL}
      openGraph={{
        title,
        description,
        url: `${getBrowserConfig("seoAppUrl")}${router.asPath}`,
        images: [
          {
            url: imageUrl,
          },
        ],
        site_name: getBrowserConfig("seoAppName"),
      }}
      twitter={{
        handle: getBrowserConfig("seoAppTwitterHandle"),
        site: getBrowserConfig("seoAppTwitterHandle"),
        cardType: "summary_large_image",
      }}
      noindex={noIndex}
      nofollow={noFollow}
    />
  );
};

export default Seo;
