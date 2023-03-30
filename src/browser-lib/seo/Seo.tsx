import React, { FC } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import config from "../../config/browser";
import { SOCIAL_SHARING_IMAGE_URL } from "../../image-data";

export const DEFAULT_SEO_PROPS = {
  title: config.get("seoAppName"),
  description: config.get("seoAppDescription"),
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

  // Trim trailing slashes
  const formattedCanonicalURL = (
    canonicalURL || `${config.get("seoAppUrl")}${router.asPath}`
  )?.replace(/\/$/, ""); //?

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={formattedCanonicalURL}
      openGraph={{
        title,
        description,
        url: `${config.get("seoAppUrl")}${router.asPath}`,
        images: [
          {
            url: imageUrl,
          },
        ],
        site_name: config.get("seoAppName"),
      }}
      twitter={{
        handle: config.get("seoAppTwitterHandle"),
        site: config.get("seoAppTwitterHandle"),
        cardType: "summary_large_image",
      }}
      noindex={noIndex}
      nofollow={noFollow}
    />
  );
};

export default Seo;
