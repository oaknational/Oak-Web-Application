import { getLessonCopyrightState } from "./getLessonCopyrightState";
import { AuthState } from "./complexCopyright.types";

import { LessonMediaClipsData } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

export function filterRestrictedLessonMediaData(
  data: LessonMediaClipsData,
  authState: AuthState,
): LessonMediaClipsData {
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
    mediaClips: {},
  };
}
