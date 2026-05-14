import { create } from "zustand";

import { Platform } from "@/browser-lib/avo/Avo";
import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import type { LessonSectionResults } from "@/context/PupilLessonProgress";
import type {
  PupilAnalyticsProviderClassroomContext,
  PupilPathwayData,
  PupilVideoData,
} from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import { getPupilVideoData } from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import type { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

type AdditionalArgs = PupilPathwayData & {
  analyticsUseCase: "Pupil";
  clientEnvironment: PupilAnalyticsProviderClassroomContext["clientEnvironment"];
  classroomAssignmentId: string | null;
  courseId: string | null;
  itemId: string | null;
  attachmentId: string | null;
  submissionId: string | null;
  teacherLoginHint: string | null;
  pupilLoginHint: string | null;
};

type PupilLessonAnalyticsState = {
  track: TrackFns | null;
  additionalArgs: AdditionalArgs | null;
  videoData: PupilVideoData | null;
  initialisePupilLessonAnalytics: (args: {
    track: TrackFns;
    pupilPathwayData: PupilPathwayData;
    classroomAssignmentContext: PupilAnalyticsProviderClassroomContext;
    lessonContent?: LessonContent;
  }) => void;
  trackSectionStarted: (args: {
    section: "intro" | "starter-quiz" | "video" | "exit-quiz" | "review";
    sectionResults: LessonSectionResults;
  }) => void;
  trackQuizQuestionAttempt: (args: {
    section: "starter-quiz" | "exit-quiz";
    questionType: string;
    isCorrect: boolean;
    hintAvailable: boolean;
    hintAccessed: boolean;
    questionNumber: number;
  }) => void;
  trackQuizCompleted: (args: {
    section: "starter-quiz" | "exit-quiz";
    sectionResults: LessonSectionResults;
    sectionStartedAt: number;
  }) => void;
  trackLessonAbandoned: () => void;
};

const getCorePropertyArgs = (
  clientEnvironment: PupilAnalyticsProviderClassroomContext["clientEnvironment"],
) =>
  ({
    platform:
      clientEnvironment === "iframe" ? Platform.GOOGLE_CLASSROOM : Platform.OWA,
    product: "pupil lesson activities",
    engagementIntent: "use",
    eventVersion: "2.0.0",
  }) as const;

const buildQuizCompletionTrackingData = ({
  section,
  sectionResults,
  sectionStartedAt,
}: {
  section: "starter-quiz" | "exit-quiz";
  sectionResults: LessonSectionResults;
  sectionStartedAt: number;
}) => ({
  pupilExperienceLessonActivity: section,
  pupilQuizGrade: sectionResults[section]?.grade || 0,
  pupilQuizNumQuestions: sectionResults[section]?.numQuestions || 0,
  hintQuestion: "",
  hintQuestionResult: "",
  hintUsed: "",
  activityTimeSpent: Date.now() - sectionStartedAt,
});

export const usePupilLessonAnalyticsStore = create<PupilLessonAnalyticsState>()(
  (set, get) => ({
    track: null,
    additionalArgs: null,
    videoData: null,
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

      set({
        track,
        videoData: lessonContent ? getPupilVideoData(lessonContent) : null,
        additionalArgs: {
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
        },
      });
    },
    trackSectionStarted: ({ section, sectionResults }) => {
      const { track, additionalArgs, videoData } = get();
      if (!track || !additionalArgs) return;

      if (section === "intro" && !sectionResults.intro?.isComplete) {
        const payload: Parameters<
          TrackFns["lessonActivityStartedIntroduction"]
        >[0] = {
          ...additionalArgs,
          pupilExperienceLessonActivity: section,
        };
        track.lessonActivityStartedIntroduction(payload);
        return;
      }

      if (
        section === "starter-quiz" &&
        !sectionResults["starter-quiz"]?.isComplete
      ) {
        const payload: Parameters<
          TrackFns["lessonActivityStartedStarterQuiz"]
        >[0] = {
          ...additionalArgs,
          pupilExperienceLessonActivity: section,
          pupilQuizGrade: sectionResults["starter-quiz"]?.grade || 0,
          pupilQuizNumQuestions:
            sectionResults["starter-quiz"]?.numQuestions || 0,
          hintAvailable: true,
        };
        track.lessonActivityStartedStarterQuiz(payload);
        return;
      }

      if (section === "exit-quiz" && !sectionResults["exit-quiz"]?.isComplete) {
        const payload: Parameters<
          TrackFns["lessonActivityStartedExitQuiz"]
        >[0] = {
          ...additionalArgs,
          pupilExperienceLessonActivity: section,
          pupilQuizGrade: sectionResults["exit-quiz"]?.grade || 0,
          pupilQuizNumQuestions: sectionResults["exit-quiz"]?.numQuestions || 0,
          hintAvailable: true,
        };
        track.lessonActivityStartedExitQuiz(payload);
        return;
      }

      if (section === "video" && !sectionResults.video?.isComplete) {
        if (!videoData) return;
        const payload: Parameters<
          TrackFns["lessonActivityStartedLessonVideo"]
        >[0] = {
          ...additionalArgs,
          ...videoData,
          pupilExperienceLessonActivity: section,
          pupilVideoDurationSeconds: sectionResults.video?.duration || 0,
          pupilVideoPlayed: sectionResults.video?.played || false,
        };
        track.lessonActivityStartedLessonVideo(payload);
      }
    },
    trackQuizQuestionAttempt: ({
      section,
      questionType,
      isCorrect,
      hintAvailable,
      hintAccessed,
      questionNumber,
    }) => {
      const { track, additionalArgs } = get();
      if (!track || !additionalArgs) return;

      track.questionAttemptSubmitted({
        ...additionalArgs,
        pupilExperienceLessonActivity: section,
        questionType,
        questionResult: isCorrect ? "correct" : "incorrect",
        activityTimeSpent: 0,
        hintOffered: hintAvailable,
        hintAccessed,
        questionNumber,
      });
    },
    trackQuizCompleted: ({ section, sectionResults, sectionStartedAt }) => {
      const { track, additionalArgs } = get();
      if (!track || !additionalArgs) return;
      const trackData = buildQuizCompletionTrackingData({
        section,
        sectionResults,
        sectionStartedAt,
      });

      if (section === "starter-quiz") {
        track.lessonActivityCompletedStarterQuiz({
          ...additionalArgs,
          ...trackData,
        });
        return;
      }

      track.lessonActivityCompletedExitQuiz({
        ...additionalArgs,
        ...trackData,
      });
    },
    trackLessonAbandoned: () => {
      const { track, additionalArgs } = get();
      if (!track || !additionalArgs) return;

      const payload: Parameters<TrackFns["lessonAbandoned"]>[0] = {
        ...additionalArgs,
        ...getCorePropertyArgs(additionalArgs.clientEnvironment),
      };
      track.lessonAbandoned(payload);
    },
  }),
);
