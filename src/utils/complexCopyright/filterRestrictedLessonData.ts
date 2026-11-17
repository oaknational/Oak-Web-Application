import { getLessonCopyrightState } from "./getLessonCopyrightState";
import { AuthState } from "./complexCopyright.types";
import { isCopyrightRestricted } from "./isCopyrightRestricted";

import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";

export function filterRestrictedLessonData(
  data: TeachersLessonOverviewPageData,
  authState: AuthState,
): TeachersLessonOverviewPageData {
  const isRestricted = isCopyrightRestricted(
    getLessonCopyrightState(
      {
        subjectSlug: data.subjectSlug,
        geoRestricted: data.geoRestricted,
        loginRequired: data.loginRequired,
      },
      authState,
    ),
  );

  if (!isRestricted) return data;

  return {
    ...data,
    lessonMediaClips: null,
    videoMuxPlaybackId: null,
    videoWithSignLanguageMuxPlaybackId: null,
    transcriptSentences: null,
    additionalFiles: null,
    lessonOutline: null,
    worksheetUrl: null,
    presentationUrl: null,
    lessonGuideUrl: null,
    hasMediaClips: false,
    starterQuiz: null,
    exitQuiz: null,
    additionalMaterialUrl: null,
  };
}
