import { getLessonCopyrightState } from "./getLessonCopyrightState";
import { AuthState } from "./complexCopyright.types";
import { isCopyrightRestricted } from "./isCopyrightRestricted";

import { LessonMediaClipsData } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

export function filterRestrictedLessonMediaData(
  data: LessonMediaClipsData,
  authState: AuthState,
): LessonMediaClipsData {
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
    mediaClips: {},
  };
}
