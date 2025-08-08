import {
  LessonBrowseDataByKs,
  LessonOverviewContent,
} from "../../queries/lessonOverview/lessonOverview.schema";

import { isRestrictedLessonId } from "./isRestrictedLessonId";
import { hasRestrictedContentGuidance } from "./hasRestrictedContentGuidence";

interface WorksListItem {
  [key: string]: unknown;
}

export const isExcludedFromTeachingMaterials = (
  browseData: LessonBrowseDataByKs["lessonData"],
  worksList: WorksListItem[], // all items are restricted or highly restricted
  content: LessonOverviewContent,
): boolean => {
  const excludedFromTeachingMaterials = worksList.length > 0;
  const hasRestrictedId = isRestrictedLessonId(browseData.lessonUid);
  const hasRestrictedContent = content
    ? hasRestrictedContentGuidance(content.contentGuidance)
    : false;
  const isLegacy = content.isLegacy ?? false;

  return (
    excludedFromTeachingMaterials ||
    hasRestrictedId ||
    hasRestrictedContent ||
    isLegacy
  );
};
