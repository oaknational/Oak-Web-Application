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
  accessLevel: "unit",
  track: {
    createTeachingMaterialsInitiated: () =>
      console.log("createTeachingMaterialsInitiated fired"),
    lessonMediaClipsStarted: () => console.log("lessonMediaClipsStarted fired"),
    lessonResourceDownloadStarted: () =>
      console.log("lessonResourceDownloadStarted fired"),
    lessonShareStarted: () => console.log("lessonShareStarted fired"),
    mediaClipsPlaylistPlayed: () =>
      console.log("mediaClipsPlaylistPlayed fired"),
    unitDownloaded: () => console.log("unitDownloaded fired"),
    curriculumExplainerExplored: () =>
      console.log("curriculumExplainerExplore fired"),
    curriculumResourcesDownloaded: () =>
      console.log("curriculumResourcesDownloaded fired"),
    curriculumResourcesDownloadRefined: () =>
      console.log("curriculumResourcesDownloadRefined fired"),
    onwardContentSelected: () => console.log("onwardContentSelected fired"),
    teachingMaterialsSelected: () =>
      console.log("teachingMaterialsSelected fired"),
    unitDownloadStarted: () => console.log("unitDownloadStarted fired"),
    unitOverviewAccessed: () => console.log("unitOverviewAccessed fired"),
    programmeAccessed: () => console.log("programmeAccessed fired"),
    programmeRefined: () => console.log("programmeRefined fired"),
    unitRefined: () => console.log("unitRefined fired"),
    videoPlayed: () => console.log("videoPlayed fired"),
    videoStarted: () => console.log("videoStarted fired"),
    videoPaused: () => console.log("videoPaused fired"),
    videoFinished: () => console.log("videoFinished fired"),
    lessonResourcesDownloaded: () =>
      console.log("lessonResourcesDownloaded fired"),
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
