import {
  LessonBrowseDataByKs,
  LessonOverviewContent,
} from "../../queries/lessonOverview/lessonOverview.schema";

import { isRestrictedLessonId } from "./isRestrictedLessonId";
import { hasRestrictedContentGuidance } from "./hasRestrictedContentGuidence";

interface WorksListItem {
  [key: string]: unknown;
}

// no content from these subjects can use create with AI
const RESTRICTED_SUBJECTS = [
  "art",
  "design-technology",
  "french",
  "geography",
  "german",
  "music",
  "spanish",
];

export const getHideCreateWithAi = ({
  subject,
  worksList,
}: {
  subject: string;
  worksList: WorksListItem[];
}) => {
  const hasRestrictedWorks = worksList.length > 0;
  const isRestrictedSubject = RESTRICTED_SUBJECTS.includes(subject);

  return isRestrictedSubject || hasRestrictedWorks;
};

export const isExcludedFromTeachingMaterials = (
  browseData: LessonBrowseDataByKs["lessonData"],
  worksList: WorksListItem[], // all items are restricted or highly restricted
  content: LessonOverviewContent,
): boolean => {
  const excludedFromTeachingMaterials = worksList.length > 0;
  const hasRestrictedId = isRestrictedLessonId(browseData.lessonUid);
  const hasRestrictedContentGuidanceThemes = content
    ? hasRestrictedContentGuidance(content.contentGuidance)
    : false;
  const isLegacy = content.isLegacy ?? false;

  return (
    excludedFromTeachingMaterials ||
    hasRestrictedId ||
    hasRestrictedContentGuidanceThemes ||
    isLegacy
  );
};
