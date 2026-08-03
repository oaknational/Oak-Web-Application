import { StoryFn } from "@storybook/react";

import { noopTrackingFns } from "./AnalyticsDecorator";

import { TeacherBrowseAnalyticsStoreContext } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import { NavigatedFrom } from "@/browser-lib/avo/Avo";
import { TeacherBrowseAnalyticsStore } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsStore";

const state: TeacherBrowseAnalyticsStore = {
  programmeState: getProgrammeStateForLesson(teachersLessonOverviewFixture()),
  avo: { ...noopTrackingFns, NavigatedFrom },
  journeyId: "mockJourneyId",
  track: {
    lessonResourceDownloadStarted: () =>
      console.log("lessonResourceDownloadStarted fired"),
    unitDownloadInitiated: () => console.log("unitDownloadInitiated fired"),
    curriculumExplainerExplored: () =>
      console.log("curriculumExplainerExplore fired"),
    curriculumResourcesDownloaded: () =>
      console.log("curriculumResourcesDownloaded fired"),
    curriculumResourcesDownloadRefined: () =>
      console.log("curriculumResourcesDownloadRefined fired"),
  },
};

export default function TeacherBrowseAnalyticsDecorator(Story: StoryFn) {
  const TeacherBrowseAnalyticsProvider =
    TeacherBrowseAnalyticsStoreContext.Provider;

  const value = {
    setState: () => undefined,
    getState: () => state,
    getInitialState: () => state,
    subscribe: () => () => console.log("subscribe"),
  };

  return (
    <TeacherBrowseAnalyticsProvider value={value}>
      <Story />
    </TeacherBrowseAnalyticsProvider>
  );
}
