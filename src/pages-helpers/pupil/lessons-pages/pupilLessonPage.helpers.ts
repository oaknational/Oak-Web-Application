import {
  PupilLessonPageProps,
  PupilLessonPageType,
} from "./pupilLessonPage.types";

import {
  isLessonReviewSection,
  LessonSection,
} from "@/components/PupilComponents/lessonSections";
import { requestLessonResources } from "@/components/PupilComponents/pupilUtils/requestLessonResources";
import { pickAvailableSectionsForLesson } from "@/components/PupilComponents/Views/ViewHelpers/Experience/pickAvailableSectionsForLesson";
import {
  LessonBrowseData,
  LessonContent,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { LessonShareVariant } from "@/pages-helpers/pupil";

export const isAvailablePupilLessonSection = (
  section: LessonSection,
  lessonContent: LessonContent,
  variant: LessonShareVariant | null,
) => {
  if (!isLessonReviewSection(section)) {
    return true;
  }

  return pickAvailableSectionsForLesson(lessonContent, variant).includes(
    section,
  );
};

export const hydrateLessonContentResources = async ({
  lessonContent,
  suppressErrors = false,
}: {
  lessonContent: LessonContent;
  suppressErrors?: boolean;
}) => {
  try {
    const transcriptSentences = await requestLessonResources({
      lessonContent,
    });

    return {
      ...lessonContent,
      transcriptSentences: transcriptSentences ?? [],
    };
  } catch (error) {
    if (!suppressErrors) {
      throw error;
    }

    return {
      ...lessonContent,
      transcriptSentences: [],
    };
  }
};

export const buildPupilLessonPageProps = async ({
  browseData,
  lessonContent,
  backUrl,
  initialSection,
  pageType,
  suppressResourceErrors = false,
  variant,
}: {
  browseData: LessonBrowseData;
  lessonContent: LessonContent;
  backUrl: string;
  initialSection: LessonSection;
  pageType: PupilLessonPageType;
  suppressResourceErrors?: boolean;
  variant: LessonShareVariant | null;
}): Promise<PupilLessonPageProps> => {
  const hydratedLessonContent = await hydrateLessonContentResources({
    lessonContent,
    suppressErrors: suppressResourceErrors,
  });

  return {
    lessonContent: hydratedLessonContent,
    browseData,
    hasWorksheet: !!lessonContent.hasWorksheetAssetObject,
    worksheetInfo: null,
    hasAdditionalFiles: !!lessonContent.downloadableFiles?.length,
    additionalFiles: lessonContent.downloadableFiles || null,
    initialSection,
    backUrl,
    pageType,
    variant,
  };
};
