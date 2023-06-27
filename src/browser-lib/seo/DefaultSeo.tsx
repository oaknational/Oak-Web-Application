import React from "react";
import { DefaultSeo as NextDefaultSeo } from "next-seo";

import config from "../../config/browser";
import {
  SOCIAL_SHARING_IMAGE_HEIGHT,
  SOCIAL_SHARING_IMAGE_URL,
  SOCIAL_SHARING_IMAGE_WIDTH,
} from "../../image-data";

const DefaultSeo = () => {
  return (
    <NextDefaultSeo
      title={config.get("seoAppName")}
      description={config.get("seoAppDescription")}
      openGraph={{
        url: config.get("seoAppName"),
        locale: config.get("seoAppLocale"),
        title: config.get("seoAppName"),
        description: config.get("seoAppDescription"),
        images: [
          {
            url: SOCIAL_SHARING_IMAGE_URL,
            width: SOCIAL_SHARING_IMAGE_WIDTH,
            height: SOCIAL_SHARING_IMAGE_HEIGHT,
            alt: config.get("seoAppName"),
          },
        ],
        site_name: config.get("seoAppName"),
      }}
      twitter={{
        handle: config.get("seoAppTwitter"),
        site: config.get("seoAppTwitter"),
        cardType: "summary_large_image",
      }}
    />
  );
};

export default DefaultSeo;
