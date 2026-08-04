import { FC, ReactNode, useState } from "react";

import useAnalytics from "../../context/Analytics/useAnalytics";

import { createTeacherBrowseAnalyticsStore } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsStore";
import { TeacherBrowseAnalyticsStoreContext } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { ProgrammeState } from "@/context/TeacherBrowseAnalytics/teacherBrowseAnalytics.types";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import { AccessLevelValueType } from "@/browser-lib/avo/Avo";

export const mockJourneyId = "mockJourneyId";

export const mockProgrammeState: ProgrammeState = getProgrammeStateForLesson(
  teachersLessonOverviewFixture(),
);

/**
 * Provides a real Teacher Browse Analytics store, but with a stubbed journeyId
 * so that tests don't need a session to be available.
 */
const MockedTeacherBrowseAnalyticsProvider: FC<{
  programmeState?: ProgrammeState;
  accessLevel?: AccessLevelValueType;
  children?: ReactNode;
}> = ({
  programmeState = mockProgrammeState,
  accessLevel = "unit",
  children,
}) => {
  const { track } = useAnalytics();

  const [store] = useState(() =>
    createTeacherBrowseAnalyticsStore({
      programmeState,
      avo: track,
      journeyId: mockJourneyId,
      accessLevel,
    }),
  );

  return (
    <TeacherBrowseAnalyticsStoreContext.Provider value={store}>
      {children}
    </TeacherBrowseAnalyticsStoreContext.Provider>
  );
};

export default MockedTeacherBrowseAnalyticsProvider;
