import React, { FC } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import config from "../../config";

const IMAGES = {
  default: config.get("appSocialSharingImg"),
};

export const DEFAULT_SEO_PROPS = {
  title: config.get("appName"),
  description: config.get("appDescription"),
};

type Images = typeof IMAGES;
type Image = keyof Images;

export type SeoProps = {
  title: string;
  description: string;
  canonicalURL?: string;
  noIndex?: boolean;
  image?: Image;
};

/**
 * Oak Seo component. A wrapper round NextSeo with sensible defaults.
 * @see [seo.md](../../../docs/seo.md)
 */
const Seo: FC<SeoProps> = ({
  title,
  description,
  canonicalURL,
  image = "default",
}) => {
  const router = useRouter();

  const sharingImage = IMAGES[image] ? IMAGES[image] : IMAGES["default"];

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={canonicalURL || `${config.get("appUrl")}${router.asPath}`}
      openGraph={{
        title,
        description,
        url: `${config.get("appUrl")}${router.asPath}`,
        images: [
          {
            url: `${config.get("appUrl")}${sharingImage}`,
            width: 1200,
            height: 630,
            alt: config.get("appName"),
          },
        ],
        site_name: config.get("appName"),
      }}
      twitter={{
        handle: config.get("appTwitterHandle"),
        site: config.get("appTwitterHandle"),
        cardType: "summary_large_image",
      }}
    />
  );
};

export default Seo;
