import { StoryFn } from "@storybook/react";

import { noopTrackingFns } from "./AnalyticsDecorator";

import { TeacherBrowseAnalyticsStoreContext } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";
import { NavigatedFrom } from "@/browser-lib/avo/Avo";

const state = {
  programmeState: getProgrammeStateForLesson(teachersLessonOverviewFixture()),
  avo: { ...noopTrackingFns, NavigatedFrom },
  track: {
    lessonResourceDownloadStarted: () =>
      console.log("lessonResourceDownloadStarted fired"),
    unitDownloadInitiated: () => console.log("unitDownloadInitiated fired"),
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
