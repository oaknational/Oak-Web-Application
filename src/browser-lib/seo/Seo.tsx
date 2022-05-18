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
  noIndex?: boolean;
  image?: Image;
};

/** 1.Seo titles should be between 50-60 characters long 
    2. Seo title should contain app name
    3. Seo descriptions should be between 150-300 characters long */
const Seo: FC<SeoProps> = ({ title, description, image = "default" }) => {
  const router = useRouter();

  const sharingImage = IMAGES[image] ? IMAGES[image] : IMAGES["default"];

  return (
    <NextSeo
      title={title}
      description={description}
      canonical={`${config.get("appUrl")}${router.asPath}`}
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
