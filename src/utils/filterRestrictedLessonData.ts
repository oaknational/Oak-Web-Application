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

export function getLessonCopyrightState(
  data: Pick<
    TeachersLessonOverviewPageData,
    "subjectSlug" | "geoRestricted" | "loginRequired"
  >,
  authState: AuthState,
) {
  const { resourceIsGeorestricted, resourceRequiresLogin } =
    getCopyrightRestrictionForSubject({
      subjectSlug: data.subjectSlug,
      geoRestricted: data.geoRestricted,
      loginRequired: data.loginRequired,
    });

  const showSignedOutLoginRequired =
    !authState.isSignedIn && resourceRequiresLogin;
  const showSignedOutGeoRestricted =
    !authState.isSignedIn && resourceIsGeorestricted;
  const showSignedInNotOnboarded =
    authState.isSignedIn &&
    !authState.isOnboarded &&
    (resourceRequiresLogin || resourceIsGeorestricted);
  const showGeoBlocked =
    authState.isSignedIn &&
    resourceIsGeorestricted &&
    !authState.isRegionAuthorised;

  return {
    showSignedOutLoginRequired,
    showSignedOutGeoRestricted,
    showSignedInNotOnboarded,
    showGeoBlocked,
    isLoaded: true,
    isResourceGeorestricted: resourceIsGeorestricted,
  };
}
