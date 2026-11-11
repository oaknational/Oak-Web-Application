import { getCopyrightRestrictionForSubject } from "./getCopyrightRestrictionForSubject";

import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";

export interface AuthState {
  isSignedIn: boolean;
  isOnboarded: boolean;
  isRegionAuthorised: boolean;
}

export function filterRestrictedLessonData(
  data: TeachersLessonOverviewPageData,
  authState: AuthState,
): TeachersLessonOverviewPageData {
  const { resourceIsGeorestricted, resourceRequiresLogin } =
    getCopyrightRestrictionForSubject({
      subjectSlug: data.subjectSlug,
      geoRestricted: data.geoRestricted,
      loginRequired: data.loginRequired,
    });

  const isSignedOutAndRestricted =
    !authState.isSignedIn && (resourceIsGeorestricted || resourceRequiresLogin);
  const isSignedInButNotOnboarded =
    authState.isSignedIn &&
    !authState.isOnboarded &&
    (resourceRequiresLogin || resourceIsGeorestricted);
  const isGeorestricted =
    authState.isSignedIn &&
    resourceIsGeorestricted &&
    !authState.isRegionAuthorised;

  const isRestricted =
    isSignedOutAndRestricted || isSignedInButNotOnboarded || isGeorestricted;

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
