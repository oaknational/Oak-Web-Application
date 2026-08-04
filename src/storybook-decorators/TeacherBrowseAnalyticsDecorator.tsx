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
    unitDownloaded: () => console.log("unitDownloaded fired"),
    curriculumExplainerExplored: () =>
      console.log("curriculumExplainerExplore fired"),
    curriculumResourcesDownloaded: () =>
      console.log("curriculumResourcesDownloaded fired"),
    curriculumResourcesDownloadRefined: () =>
      console.log("curriculumResourcesDownloadRefined fired"),
    lessonResourceDownloadStarted: () =>
      console.log("lessonResourceDownloadStarted fired"),
    programmeAccessed: () => console.log("programmeAccessed fired"),
    programmeRefined: () => console.log("programmeRefined fired"),
    unitDownloadStarted: () => console.log("unitDownloadStarted fired"),
    unitOverviewAccessed: () => console.log("unitOverviewAccessed fired"),
    unitRefined: () => console.log("unitRefined fired"),
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
