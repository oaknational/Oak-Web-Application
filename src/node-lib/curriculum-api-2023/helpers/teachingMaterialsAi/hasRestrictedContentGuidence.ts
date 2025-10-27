import { LessonOverviewContent } from "../../queries/lessonOverview/lessonOverview.schema";

const RESTRICTED_CONTENT_GUIDANCE_TYPES = [
  "Depiction or discussion of sexual violence",
  "Depiction or discussion of sexual content",
  "Depiction or discussion of mental health issues",
  "Depiction or discussion of serious crime",
] as const;

export function hasRestrictedContentGuidance(
  content: LessonOverviewContent["contentGuidance"],
): boolean {
  if (!content || content.length === 0) {
    return false;
  }

  const contentGuidanceLabels = content.map((item) => ({
    contentGuidanceLabel: item.contentguidanceLabel ?? "",
  }));

  const hasRestrictedContent = contentGuidanceLabels.some((item) =>
    RESTRICTED_CONTENT_GUIDANCE_TYPES.includes(
      item.contentGuidanceLabel as (typeof RESTRICTED_CONTENT_GUIDANCE_TYPES)[number],
    ),
  );
  return hasRestrictedContent;
}
