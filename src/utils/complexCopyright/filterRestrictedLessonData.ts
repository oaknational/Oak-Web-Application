import { getLessonCopyrightState } from "./getLessonCopyrightState";
import { AuthState } from "./complexCopyright.types";

import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";

export function filterRestrictedLessonData(
  data: TeachersLessonOverviewPageData,
  authState: AuthState,
): TeachersLessonOverviewPageData {
  const {
    showSignedOutLoginRequired,
    showSignedOutGeoRestricted,
    showSignedInNotOnboarded,
    showGeoBlocked,
  } = getLessonCopyrightState(
    {
      subjectSlug: data.subjectSlug,
      geoRestricted: data.geoRestricted,
      loginRequired: data.loginRequired,
    },
    authState,
  );
  const isRestricted =
    showSignedOutLoginRequired ||
    showSignedOutGeoRestricted ||
    showSignedInNotOnboarded ||
    showGeoBlocked;

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
  };
}
