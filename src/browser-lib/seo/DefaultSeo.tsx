import React from "react";
import { DefaultSeo as NextDefaultSeo } from "next-seo";

import config from "../../config/browser";

const DefaultSeo = () => {
  return (
    <NextDefaultSeo
      // Disable indexing and follow on this branch.
      dangerouslySetAllPagesToNoFollow={true}
      dangerouslySetAllPagesToNoIndex={true}
      title={config.get("seoAppName")}
      description={config.get("seoAppDescription")}
      openGraph={{
        url: config.get("seoAppName"),
        locale: config.get("seoAppLocale"),
        title: config.get("seoAppName"),
        description: config.get("seoAppDescription"),
        images: [
          {
            url: `${config.get("seoAppUrl")}${config.get(
              "seoAppSocialSharingImg"
            )}`,
            width: 1280,
            height: 630,
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
