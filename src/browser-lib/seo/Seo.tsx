import React, { FC } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import config from "../../config";

export const DEFAULT_SEO_PROPS = {
  title: config.get("appName"),
  description: config.get("appDescription"),
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
  imageUrl = `${config.get("appUrl")}${config.get("appSocialSharingImg")}?2022`,
  noIndex = false,
  noFollow = false,
  canonicalURL,
}) => {
  const router = useRouter();

  // Trim trailing slashes
  const formattedCanonicalURL = (
    canonicalURL || `${config.get("appUrl")}${router.asPath}`
  )?.replace(/\/$/, ""); //?

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={formattedCanonicalURL}
      openGraph={{
        title,
        description,
        url: `${config.get("appUrl")}${router.asPath}`,
        images: [
          {
            url: imageUrl,
          },
        ],
        site_name: config.get("appName"),
      }}
      twitter={{
        handle: config.get("appTwitterHandle"),
        site: config.get("appTwitterHandle"),
        cardType: "summary_large_image",
      }}
      noindex={noIndex}
      nofollow={noFollow}
    />
  );
};

export default Seo;
