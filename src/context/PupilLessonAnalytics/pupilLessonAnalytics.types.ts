import type { TrackFns } from "@/context/Analytics/AnalyticsProvider";
import type { LessonSectionResults } from "@/context/PupilLessonProgress";
import type {
  PupilAnalyticsProviderClassroomContext,
  PupilPathwayData,
  PupilVideoData,
} from "@/components/PupilComponents/PupilAnalyticsProvider/PupilAnalyticsProvider";
import type { LessonContent } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import type { QuestionsArray } from "@/context/PupilLessonQuiz";

export type AdditionalArgs = PupilPathwayData & {
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

export type TrackSectionStartedArgs = {
  section: "intro" | "starter-quiz" | "video" | "exit-quiz" | "review";
  sectionResults: LessonSectionResults;
};

export type TrackQuizQuestionAttemptArgs = {
  section: "starter-quiz" | "exit-quiz";
  questionType: string;
  isCorrect: boolean;
  hintAvailable: boolean;
  hintAccessed: boolean;
  questionNumber: number;
};

export type TrackQuizCompletedArgs = {
  section: "starter-quiz" | "exit-quiz";
  sectionResults: LessonSectionResults;
  sectionStartedAt: number;
};

export type TrackSectionResultArgs = {
  sectionResults: LessonSectionResults;
};

export type TrackSectionCompletedArgs = TrackSectionResultArgs & {
  sectionStartedAt: number;
};

export type TrackReviewEventArgs = TrackSectionResultArgs & {
  starterQuizQuestionsArray: QuestionsArray;
  exitQuizQuestionsArray: QuestionsArray;
};

export type TrackQuizAbandonedArgs = {
  section: "starter-quiz" | "exit-quiz";
  sectionResults: LessonSectionResults;
  sectionStartedAt: number;
};

export type TrackSectionAbandonedArgs = {
  sectionStartedAt: number;
};

export type TrackSectionResultAbandonedArgs = TrackSectionResultArgs & {
  sectionStartedAt: number;
};

export type TrackContentGuidanceArgs = Omit<
  Parameters<TrackFns["contentGuidanceAccepted"]>[0],
  keyof AdditionalArgs
>;

export type InitialisePupilLessonAnalyticsArgs = {
  track: TrackFns;
  pupilPathwayData: PupilPathwayData;
  classroomAssignmentContext: PupilAnalyticsProviderClassroomContext;
  lessonContent?: LessonContent;
};

export type PupilLessonAnalyticsState = {
  track: TrackFns | null;
  additionalArgs: AdditionalArgs | null;
  videoData: PupilVideoData | null;
  accessedLessonSlug: string | null;
  initialisePupilLessonAnalytics: (
    args: InitialisePupilLessonAnalyticsArgs,
  ) => void;
  trackSectionStarted: (args: TrackSectionStartedArgs) => void;
  trackQuizQuestionAttempt: (args: TrackQuizQuestionAttemptArgs) => void;
  trackQuizCompleted: (args: TrackQuizCompletedArgs) => void;
  trackQuizAbandoned: (args: TrackQuizAbandonedArgs) => void;
  trackLessonStarted: () => void;
  trackLessonCompleted: () => void;
  trackLessonAbandoned: () => void;
  trackIntroCompleted: (args: TrackSectionAbandonedArgs) => void;
  trackIntroAbandoned: (args: TrackSectionAbandonedArgs) => void;
  trackWorksheetDownloaded: () => void;
  trackVideoCompleted: (args: TrackSectionCompletedArgs) => void;
  trackVideoAbandoned: (args: TrackSectionResultAbandonedArgs) => void;
  trackLessonSummaryReviewed: (args: TrackReviewEventArgs) => void;
  trackActivityResultsShared: (args: TrackReviewEventArgs) => void;
  trackContentGuidanceAccepted: (args: TrackContentGuidanceArgs) => void;
  trackContentGuidanceDeclined: (args: TrackContentGuidanceArgs) => void;
};

export type PupilLessonAnalyticsGet = () => PupilLessonAnalyticsState;
