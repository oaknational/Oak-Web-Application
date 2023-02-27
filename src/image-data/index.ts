import uiIcons from "./generated/ui-icons.json";
import uiGraphics from "./generated/ui-graphics.json";
import subjectIcons from "./generated/subject-icons.json";

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
export const getSubjectIconAsset = (
  maybeSlug: string
): SubjectIconAsset | undefined => {
  return subjectIconsByString[maybeSlug];
};
