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

  // Trim trailing slashes
  const formattedCanonicalURL = (
    canonicalURL || `${getBrowserConfig("seoAppUrl")}${router.asPath}`
  )?.replace(/\/$/, ""); //?

  // DEBUG
  // console.log("title", title);
  // console.log("description", description);
  // console.log("formattedCanonicalURL", formattedCanonicalURL);
  // const twitterHandle = getBrowserConfig("seoAppTwitterHandle");
  // console.log("twitter handle", twitterHandle);
  // if (!title || !description || !formattedCanonicalURL || !twitterHandle) {
  //   throw new TypeError("Seo props are not set");
  // }

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
