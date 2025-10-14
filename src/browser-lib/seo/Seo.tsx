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
  function stripSidParams(url: string): string {
    const urlObj = new URL(url, getBrowserConfig("seoAppUrl"));
    const params = new URLSearchParams(urlObj.search);

    // Remove all parameters that start with 'sid'
    Array.from(params.keys()).forEach((key) => {
      if (key.startsWith("sid")) {
        params.delete(key);
      }
    });

    const cleanSearch = params.toString();
    const pathname = urlObj.pathname;
    return cleanSearch ? `${pathname}?${cleanSearch}` : pathname;
  }

  // Build canonical URL from router.asPath or provided canonicalURL
  const baseCanonicalPath = canonicalURL
    ? canonicalURL
    : `${getBrowserConfig("seoAppUrl")}${router.asPath}`;

  // Strip sid params and trim trailing slashes
  const cleanPath = stripSidParams(baseCanonicalPath);
  const formattedCanonicalURL =
    `${getBrowserConfig("seoAppUrl")}${cleanPath}`.replace(/\/$/, "");

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
