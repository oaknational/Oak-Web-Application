import React from "react";
import { DefaultSeo as NextDefaultSeo } from "next-seo";

import config from "../../config";

// Default value of false.
const disableSeo = config.get("disableSeo");

const DefaultSeo = () => {
  return (
    <NextDefaultSeo
      dangerouslySetAllPagesToNoFollow={disableSeo}
      dangerouslySetAllPagesToNoIndex={disableSeo}
      title={config.get("appName")}
      description={config.get("appDescription")}
      openGraph={{
        url: config.get("appName"),
        locale: config.get("appLocale"),
        title: config.get("appName"),
        description: config.get("appDescription"),
        images: [
          {
            url: `${config.get("appUrl")}${config.get("appSocialSharingImg")}`,
            width: 1280,
            height: 630,
            alt: config.get("appName"),
          },
        ],
        site_name: config.get("appName"),
      }}
      twitter={{
        handle: config.get("appTwitter"),
        site: config.get("appTwitter"),
        cardType: "summary_large_image",
      }}
    />
  );
};

export default DefaultSeo;
