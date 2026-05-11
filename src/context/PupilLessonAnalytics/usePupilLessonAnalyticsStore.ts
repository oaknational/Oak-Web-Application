import { create } from "zustand";

import { getPupilVideoData } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import type {
  AdditionalArgs,
  PupilLessonAnalyticsState,
} from "@/context/PupilLessonAnalytics/pupilLessonAnalytics.types";
import {
  trackLessonAbandoned,
  trackLessonAccessed,
} from "@/context/PupilLessonAnalytics/trackingFunctions/lessonTracking";
import { trackIntroStarted } from "@/context/PupilLessonAnalytics/trackingFunctions/introTracking";
import {
  trackQuizCompleted,
  trackQuizQuestionAttempt,
  trackQuizStarted,
} from "@/context/PupilLessonAnalytics/trackingFunctions/quizTracking";
import { trackVideoStarted } from "@/context/PupilLessonAnalytics/trackingFunctions/videoTracking";

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
    trackLessonAbandoned: () => trackLessonAbandoned(get),
  }),
);
