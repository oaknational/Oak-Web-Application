import {
  LessonBrowseDataByKs,
  LessonOverviewContent,
} from "../../queries/lessonOverview/lessonOverview.schema";
import { Restrictions } from "../../queries/teachersLessonOverview/teachersLessonOverview.schema";

import { isRestrictedLessonId } from "./isRestrictedLessonId";
import { hasRestrictedContentGuidance } from "./hasRestrictedContentGuidence";

interface WorksListItem {
  [key: string]: unknown;
}

// no content from these subjects can use create with AI
export const RESTRICTED_SUBJECTS = new Set([
  "art",
  "design-technology",
  "french",
  "geography",
  "german",
  "music",
  "spanish",
]);

const restrictedLevels = new Set(["Restricted", "Highly restricted"]);

export const getHideCreateWithAi = ({
  subject,
  worksList,
  restrictions,
  features,
}: {
  subject: string;
  worksList: WorksListItem[];
  restrictions?: Restrictions;
  features: { hasCopyrightConflict?: boolean };
}) => {
  const hasRestrictedWorks = worksList.length > 0;
  const isRestrictedSubject = RESTRICTED_SUBJECTS.has(subject);
  const hasCopyrightConflict = features?.["hasCopyrightConflict"] === true;
  const {
    tpc_media_max_restriction: mediaRestriction,
    tpc_downloadablefiles_max_restriction: downloadableFilesRestriction,
    tpc_quizimages_max_restriction: quizImageRestrictions,
    tpc_works_max_restriction: worksRestriction,
  } = restrictions ?? {};

  const hasMediaRestriction =
    mediaRestriction && restrictedLevels.has(mediaRestriction);
  const hasdownloadableFilesRestriction =
    downloadableFilesRestriction &&
    restrictedLevels.has(downloadableFilesRestriction);
  const hasQuizImageRestriction =
    quizImageRestrictions && restrictedLevels.has(quizImageRestrictions);
  const hasWorksRestriction =
    worksRestriction && restrictedLevels.has(worksRestriction);

  return Boolean(
    isRestrictedSubject ||
      hasRestrictedWorks ||
      hasMediaRestriction ||
      hasdownloadableFilesRestriction ||
      hasQuizImageRestriction ||
      hasWorksRestriction ||
      hasCopyrightConflict,
  );
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
