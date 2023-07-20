import React from "react";
import { DefaultSeo as NextDefaultSeo } from "next-seo";

import {
  SOCIAL_SHARING_IMAGE_HEIGHT,
  SOCIAL_SHARING_IMAGE_URL,
  SOCIAL_SHARING_IMAGE_WIDTH,
} from "../../image-data";
import getBrowserConfig from "../getBrowserConfig";

const DefaultSeo = () => {
  return (
    <NextDefaultSeo
      title={getBrowserConfig("seoAppName")}
      description={getBrowserConfig("seoAppDescription")}
      openGraph={{
        url: getBrowserConfig("seoAppName"),
        locale: getBrowserConfig("seoAppLocale"),
        title: getBrowserConfig("seoAppName"),
        description: getBrowserConfig("seoAppDescription"),
        images: [
          {
            url: SOCIAL_SHARING_IMAGE_URL,
            width: SOCIAL_SHARING_IMAGE_WIDTH,
            height: SOCIAL_SHARING_IMAGE_HEIGHT,
            alt: getBrowserConfig("seoAppName"),
          },
        ],
        site_name: getBrowserConfig("seoAppName"),
      }}
      twitter={{
        handle: getBrowserConfig("seoAppTwitter"),
        site: getBrowserConfig("seoAppTwitter"),
        cardType: "summary_large_image",
      }}
    />
  );
};

export default DefaultSeo;
