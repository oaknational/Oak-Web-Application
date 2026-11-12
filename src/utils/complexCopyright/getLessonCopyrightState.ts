import { getCopyrightRestrictionForSubject } from "../getCopyrightRestrictionForSubject";

import { AuthState, ComplexCopyrightStatus } from "./complexCopyright.types";
import { getComplexCopyrightState } from "./getComplexCopyrightState";

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

  return getComplexCopyrightState({
    authState,
    resourceIsGeorestricted,
    resourceRequiresLogin,
  });
}
