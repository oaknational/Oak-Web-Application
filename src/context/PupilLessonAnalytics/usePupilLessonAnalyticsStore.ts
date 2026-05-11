import { create } from "zustand";

import { getPupilVideoData } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import type {
  AdditionalArgs,
  PupilLessonAnalyticsState,
} from "@/context/PupilLessonAnalytics/pupilLessonAnalytics.types";
import {
  trackLessonCompleted,
  trackLessonAbandoned,
  trackLessonAccessed,
  trackLessonStarted,
} from "@/context/PupilLessonAnalytics/trackingFunctions/lessonTracking";
import {
  trackIntroAbandoned,
  trackIntroCompleted,
  trackIntroStarted,
  trackWorksheetDownloaded,
} from "@/context/PupilLessonAnalytics/trackingFunctions/introTracking";
import {
  trackQuizAbandoned,
  trackQuizCompleted,
  trackQuizQuestionAttempt,
  trackQuizStarted,
} from "@/context/PupilLessonAnalytics/trackingFunctions/quizTracking";
import {
  trackVideoAbandoned,
  trackVideoCompleted,
  trackVideoStarted,
} from "@/context/PupilLessonAnalytics/trackingFunctions/videoTracking";
import {
  trackActivityResultsShared,
  trackLessonSummaryReviewed,
} from "@/context/PupilLessonAnalytics/trackingFunctions/reviewTracking";

export const usePupilLessonAnalyticsStore = create<PupilLessonAnalyticsState>()(
  (set, get) => ({
    track: null,
    additionalArgs: null,
    videoData: null,
    accessedLessonSlug: null,
    initialisePupilLessonAnalytics: ({
      track,
      pupilPathwayData,
      classroomAssignmentContext,
      lessonContent,
    }) => {
      const {
        courseId,
        itemId,
        attachmentId,
        clientEnvironment,
        classroomAssignmentId,
      } = classroomAssignmentContext;
      const additionalArgs: AdditionalArgs = {
        ...pupilPathwayData,
        analyticsUseCase: "Pupil",
        clientEnvironment,
        classroomAssignmentId,
        courseId,
        itemId,
        attachmentId,
        submissionId: null,
        teacherLoginHint: null,
        pupilLoginHint: null,
      };

      if (get().accessedLessonSlug !== pupilPathwayData.lessonSlug) {
        trackLessonAccessed({ track, additionalArgs });
      }

      set({
        track,
        videoData: lessonContent ? getPupilVideoData(lessonContent) : null,
        additionalArgs,
        accessedLessonSlug: pupilPathwayData.lessonSlug,
      });
    },
    trackSectionStarted: (args) => {
      trackIntroStarted(get, args);
      trackQuizStarted(get, args);
      trackVideoStarted(get, args);
    },
    trackQuizQuestionAttempt: (args) => trackQuizQuestionAttempt(get, args),
    trackQuizCompleted: (args) => trackQuizCompleted(get, args),
    trackQuizAbandoned: ({ section, sectionResults }) =>
      trackQuizAbandoned(get, section, sectionResults),
    trackLessonStarted: () => trackLessonStarted(get),
    trackLessonCompleted: () => trackLessonCompleted(get),
    trackLessonAbandoned: () => trackLessonAbandoned(get),
    trackIntroCompleted: () => trackIntroCompleted(get),
    trackIntroAbandoned: () => trackIntroAbandoned(get),
    trackWorksheetDownloaded: () => trackWorksheetDownloaded(get),
    trackVideoCompleted: ({ sectionResults }) =>
      trackVideoCompleted(get, sectionResults),
    trackVideoAbandoned: ({ sectionResults }) =>
      trackVideoAbandoned(get, sectionResults),
    trackLessonSummaryReviewed: ({ sectionResults }) =>
      trackLessonSummaryReviewed(get, sectionResults),
    trackActivityResultsShared: ({ sectionResults }) =>
      trackActivityResultsShared(get, sectionResults),
  }),
);
