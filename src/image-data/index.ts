/**
 * This file contains imports, generates types for, and exports image data
 * generated during the build steps. @see /scripts/build/image_data
 * Other files which consume this image data should import from this file,
 * rather than importing directly from ./generated
 */
import config from "../config/browser";

import uiIcons from "./generated/ui-icons.json";
import uiGraphics from "./generated/ui-graphics.json";
import subjectIcons from "./generated/subject-icons.json";
import illustrations from "./generated/illustrations.json";
import inlineSprite from "./generated/inline-sprite.json";
import socialSharingImage from "./generated/social-sharing-image.json";
import faviconLinks from "./generated/favicons.json";

export type InlineSpriteSvgName = keyof typeof inlineSprite;
export type UiIconName = keyof typeof uiIcons;
export type UiGraphicName = keyof typeof uiGraphics;

export const ICON_NAMES = Object.keys(uiIcons) as UiIconName[];
export const GRAPHIC_NAMES = Object.keys(uiGraphics) as UiGraphicName[];

type AvailableSubjectIcons = typeof subjectIcons;
type SubjectIconSlug = keyof AvailableSubjectIcons;
type SubjectIconAsset = AvailableSubjectIcons[SubjectIconSlug];
const subjectIconsByString = subjectIcons as Record<
  string,
  SubjectIconAsset | undefined
>;

/**
 * Subject icons use the subject slug, which comes from the curriculum API and
 * is just typed as string
 */
export const getSubjectIconAsset = (
  maybeSlug: string
): SubjectIconAsset | undefined => {
  return subjectIconsByString[maybeSlug];
};

type AvailableIllustrations = typeof illustrations;
export type IllustrationSlug = keyof AvailableIllustrations;
type IllustrationAsset = AvailableIllustrations[IllustrationSlug];
export const getIllustrationAsset = (
  slug: IllustrationSlug
): IllustrationAsset => {
  return illustrations[slug];
};

export const SOCIAL_SHARING_IMAGE_HEIGHT = socialSharingImage.height;
export const SOCIAL_SHARING_IMAGE_WIDTH = socialSharingImage.width;
export const SOCIAL_SHARING_IMAGE_URL = `${config.get("seoAppUrl")}/${
  socialSharingImage.filePath
}?${new Date().getFullYear()}`;

export const FAVICON_LINKS_HEAD_INNER_HTML = faviconLinks.innerHTML;
