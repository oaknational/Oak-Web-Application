import React from "react";
import { DefaultSeo as NextDefaultSeo } from "next-seo";

import config from "../../config";

const DefaultSeo = () => {
  return (
    <NextDefaultSeo
      /* Remove before launch https://github.com/oaknational/Oak-Web-Application/issues/118 */
      dangerouslySetAllPagesToNoFollow={true}
      dangerouslySetAllPagesToNoIndex={true}
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
            width: 1200,
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
