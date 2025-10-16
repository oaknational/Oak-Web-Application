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

    const parsedUrl = new URL(url);
    const params = parsedUrl.searchParams;

    let hasChanges = false;

    // Create a new URLSearchParams with only non-tracking params
    const cleanedParams = new URLSearchParams();

    for (const [key, value] of params.entries()) {
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

    // Rebuild the URL with cleaned params
    parsedUrl.search = cleanedParams.toString();

    return parsedUrl.toString();
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
