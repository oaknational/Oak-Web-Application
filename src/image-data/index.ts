/**
 * This file contains imports, generates types for, and exports image data
 * generated during the build steps. @see /scripts/build/image_data
 * Other files which consume this image data should import from this file,
 * rather than importing directly from ./generated
 */
import { imageBuilder } from "../components/CMSImage/sanityImageBuilder";
import theme from "../styles/theme/default.theme";

import uiIcons from "./generated/ui-icons.json";
import uiGraphics from "./generated/ui-graphics.json";
import subjectIcons from "./generated/subject-icons.json";
import illustrations from "./generated/illustrations.json";
import brandAssets from "./generated/brand-assets.json";
import inlineSprite from "./generated/inline-sprite.json";

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

export const SOCIAL_SHARING_IMAGE_HEIGHT = 630;
export const SOCIAL_SHARING_IMAGE_WIDTH = 1280;
export const SOCIAL_SHARING_IMAGE_URL = imageBuilder
  .image(brandAssets["logo-with-text"])
  .width(SOCIAL_SHARING_IMAGE_WIDTH)
  .height(SOCIAL_SHARING_IMAGE_HEIGHT)
  .format("png")
  .rect(0, 0, 1920, 880)
  .bg(theme.colors.pupilsLimeGreen.slice(1))
  .url();
