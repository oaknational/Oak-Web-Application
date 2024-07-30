export type QuestionFeedbackType = "correct" | "incorrect" | null;
export type QuestionModeType =
  | "init"
  | "incomplete"
  | "input"
  | "grading"
  | "feedback";

export type PupilAnswerMatch = string[];
export type PupilAnswerOrder = number[];
export type PupilAnswerShort = string;
export type PupilAnswerMCQ = number | number[];

export type PupilAnswer =
  | PupilAnswerMatch
  | PupilAnswerOrder
  | PupilAnswerShort
  | PupilAnswerMCQ
  | PupilAnswerMCQs;

type QuestionState = {
  mode: QuestionModeType;
  grade: number;
  offerHint: boolean;
  pupilAnswer?: PupilAnswer | null;
  feedback?: QuestionFeedbackType | QuestionFeedbackType[]; // whether each part of the answer is correct or incorrect
  correctAnswer?: string | (string | undefined)[]; // The text for the correct answer to be displayed in the feedback in the review section
  isPartiallyCorrect?: boolean;
};
