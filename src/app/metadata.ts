import { Metadata } from "next";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import {
  SOCIAL_SHARING_IMAGE_HEIGHT,
  SOCIAL_SHARING_IMAGE_URL,
  SOCIAL_SHARING_IMAGE_WIDTH,
} from "@/image-data";

/**
 * Get default open graph metadata with optional overrides
 */
export const getOpenGraphMetadata = (
  overrides: Partial<Metadata["openGraph"]> = {},
): Metadata["openGraph"] => ({
  title: getBrowserConfig("seoAppName"),
  description: getBrowserConfig("seoAppDescription"),
  locale: getBrowserConfig("seoAppLocale"),
  siteName: getBrowserConfig("seoAppName"),
  images: [
    {
      url: SOCIAL_SHARING_IMAGE_URL,
      width: SOCIAL_SHARING_IMAGE_WIDTH,
      height: SOCIAL_SHARING_IMAGE_HEIGHT,
      alt: getBrowserConfig("seoAppName"),
    },
  ],
  ...overrides,
});

/**
 * Get default Twitter metadata with optional overrides
 */
export const getTwitterMetadata = (
  overrides: Partial<Metadata["twitter"]> = {},
): Metadata["twitter"] => ({
  card: "summary_large_image",
  site: getBrowserConfig("seoAppTwitterHandle"),
  creator: getBrowserConfig("seoAppTwitterHandle"),
  ...overrides,
});
