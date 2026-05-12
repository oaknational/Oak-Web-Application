import { QuestionState } from "@/components/PupilComponents/QuizUtils/questionTypes";

export const allLessonReviewSections = [
  "intro",
  "starter-quiz",
  "video",
  "exit-quiz",
] as const;

export type LessonReviewSection = (typeof allLessonReviewSections)[number];

export type QuizResult = {
  grade: number;
  numQuestions: number;
  questionResults?: QuestionState[];
};

export type VideoResult = {
  played: boolean;
  duration: number;
  timeElapsed: number;
  muted: boolean;
  signedOpened: boolean;
  transcriptOpened: boolean;
};

export type IntroResult = Partial<{
  worksheetAvailable: boolean;
  worksheetDownloaded: boolean;
  filesDownloaded?: boolean;
  additionalFilesAvailable?: boolean;
}>;

export type LessonSectionResults = Partial<{
  "starter-quiz": { isComplete: boolean } & QuizResult;
  "exit-quiz": { isComplete: boolean } & QuizResult;
  video: { isComplete: boolean } & VideoResult;
  intro: { isComplete: boolean } & IntroResult;
}>;

export type LessonProgressInitArgs = {
  lessonSlug: string;
  lessonReviewSections: Readonly<LessonReviewSection[]>;
  initialSectionResults?: LessonSectionResults;
  isReadOnly?: boolean;
  isHydratingInitialProgress?: boolean;
};

export type PupilLessonProgressState = {
  lessonSlug: string | null;
  lessonReviewSections: Readonly<LessonReviewSection[]>;
  sectionResults: LessonSectionResults;
  lessonStarted: boolean;
  isLessonComplete: boolean;
  isReadOnly: boolean;
  isHydratingInitialProgress: boolean;
  contentGuidanceDismissed: boolean;
  initialiseLessonProgress: (args: LessonProgressInitArgs) => void;
  markLessonStarted: () => void;
  completeSection: (section: LessonReviewSection) => void;
  updateSectionInProgressResult: (
    section: LessonReviewSection,
    result: QuizResult | VideoResult | IntroResult,
  ) => void;
  updateWorksheetDownloaded: (result: IntroResult) => void;
  updateAdditionalFilesDownloaded: (result: IntroResult) => void;
  dismissContentGuidance: () => void;
  setHydratingInitialProgress: (isHydrating: boolean) => void;
  resetLessonProgress: () => void;
};

export type PupilLessonProgressDataState = Omit<
  PupilLessonProgressState,
  | "initialiseLessonProgress"
  | "markLessonStarted"
  | "completeSection"
  | "updateSectionInProgressResult"
  | "updateWorksheetDownloaded"
  | "updateAdditionalFilesDownloaded"
  | "dismissContentGuidance"
  | "setHydratingInitialProgress"
  | "resetLessonProgress"
>;
