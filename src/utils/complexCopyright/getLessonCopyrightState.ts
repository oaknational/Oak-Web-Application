import { getCopyrightRestrictionForSubject } from "../getCopyrightRestrictionForSubject";

import { AuthState, ComplexCopyrightStatus } from "./complexCopyright.types";

import { TeachersLessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/teachersLessonOverview/teachersLessonOverview.schema";

export function getLessonCopyrightState(
  data: Pick<
    TeachersLessonOverviewPageData,
    "subjectSlug" | "geoRestricted" | "loginRequired"
  >,
  authState: AuthState,
): ComplexCopyrightStatus {
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
