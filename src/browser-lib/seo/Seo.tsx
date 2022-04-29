import React, { FC } from "react";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import config from "../../config";

const IMAGES = {
  default: config.get("appSocialSharingImg"),
};

type Images = typeof IMAGES;
type Image = keyof Images;

type SEOProps = {
  title: string;
  description: string;
  noIndex?: boolean;
  image?: Image;
};

const Seo: FC<SEOProps> = ({ title, description, image = "default" }) => {
  const router = useRouter();

  const sharingImage = IMAGES[image] ? IMAGES[image] : IMAGES["default"];

  console.log(router.asPath);

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
