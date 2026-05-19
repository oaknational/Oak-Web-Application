import {
  QuestionModeType,
  QuestionState,
} from "@/components/PupilComponents/QuizUtils/questionTypes";
import { QuizSection } from "@/components/PupilComponents/Views/PupilLessonQuiz";
import { QuizQuestion } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

export type QuestionsArray = NonNullable<QuizQuestion[]>;

export type PupilLessonQuizInitArgs = {
  lessonSlug: string;
  section: QuizSection;
  questionsArray: QuestionsArray;
  initialQuestionResults?: QuestionState[];
};

export type PupilLessonQuizState = {
  lessonSlug: string | null;
  section: QuizSection | null;
  currentQuestionIndex: number;
  questionState: QuestionState[];
  numQuestions: number;
  numInteractiveQuestions: number;
  isHydratedComplete: boolean;
  initialiseQuiz: (args: PupilLessonQuizInitArgs) => void;
  updateQuestionMode: (mode: QuestionModeType) => void;
  updateHintOffered: (offerHint: boolean) => void;
  applyCurrentQuestionResult: (result: Partial<QuestionState>) => void;
  handleNextQuestion: () => void;
  resetQuiz: () => void;
};

export type PupilLessonQuizDataState = Omit<
  PupilLessonQuizState,
  | "initialiseQuiz"
  | "updateQuestionMode"
  | "updateHintOffered"
  | "applyCurrentQuestionResult"
  | "handleNextQuestion"
  | "resetQuiz"
>;
