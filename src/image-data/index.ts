import uiIcons from "./generated/ui-icons.json";
import uiGraphics from "./generated/ui-graphics.json";
import subjectIcons from "./generated/subject-icons.json";
import illustrations from "./generated/illustrations.json";
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
