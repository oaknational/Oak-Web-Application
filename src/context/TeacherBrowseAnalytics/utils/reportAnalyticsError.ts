import { ProgrammeState } from "../teacherBrowseAnalytics.types";
import { TeacherBrowseAnalyticsStore } from "../TeacherBrowseAnalyticsStore";

import errorReporter from "@/common-lib/error-reporter";
import OakError, { ErrorMeta } from "@/errors/OakError";

const reportError = errorReporter("teacher-browse-analytics");

export type AnalyticsErrorMeta = ErrorMeta & {
  event: keyof TeacherBrowseAnalyticsStore["track"];
  programmeState: ProgrammeState | null;
};

/**
 * Report a tracking problem, tagged with the event and the browse level it
 * was fired from.
 */
export const reportAnalyticsError = ({
  event,
  programmeState,
  ...meta
}: AnalyticsErrorMeta) => {
  reportError(
    new OakError({
      code: "analytics/teacher-browse",
      meta: {
        event,
        browseLevel: programmeState?.browseLevel ?? "unknown",
        ...meta,
      },
    }),
  );
};
