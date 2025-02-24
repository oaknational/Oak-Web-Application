"use client";
import React, { FC } from "react";
import { NextSeo } from "next-seo";
import { usePathname, useRouter } from "next/navigation";

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
  const path = usePathname();
  // Trim trailing slashes
  const formattedCanonicalURL = (
    canonicalURL || `${getBrowserConfig("seoAppUrl")}${path}`
  )?.replace(/\/$/, ""); //?

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={formattedCanonicalURL}
      openGraph={{
        title,
        description,
        url: `${getBrowserConfig("seoAppUrl")}${path}`,
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
