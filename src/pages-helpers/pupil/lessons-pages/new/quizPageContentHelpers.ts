import { QuizSection } from "@/components/PupilComponents/Views/PupilLessonQuiz";
import {
  gradeMatchQuestion,
  gradeMultipleChoiceQuestion,
  gradeOrderQuestion,
  gradeShortAnswerQuestion,
} from "@/components/PupilComponents/Views/ViewHelpers/Quiz";
import {
  LessonReviewSection,
  LessonSectionResults,
} from "@/context/PupilLessonProgress";
import { QuestionsArray } from "@/context/PupilLessonQuiz";
import type {
  MCAnswer,
  QuizQuestion,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";

/**
 * Determines where to redirect when a hydrated quiz is already complete.
 *
 * @param section - The current quiz section.
 * @returns The destination section for the redirect.
 */
export const getHydratedQuizRedirectSection = (section: QuizSection) =>
  section === "exit-quiz" ? "review" : "overview";

/**
 * Marks the current quiz section as complete in a copied section results object.
 *
 * @param params - The values required to update section results.
 * @param params.section - The current quiz section.
 * @param params.sectionResults - The existing lesson section results.
 * @returns A copied section results object with the current section marked complete.
 */
export const getCompletedQuizSectionResults = ({
  section,
  sectionResults,
}: {
  section: QuizSection;
  sectionResults: LessonSectionResults;
}) => ({
  ...sectionResults,
  [section]: {
    ...sectionResults[section],
    isComplete: true,
  },
});

/**
 * Chooses the next destination after a quiz section is completed.
 *
 * @param params - The values required to determine the destination.
 * @param params.sectionResults - The current lesson section results.
 * @param params.lessonReviewSections - The sections required before review is available.
 * @returns `"review"` when all review sections are complete, otherwise `"overview"`.
 */
export const getQuizCompletionDestination = ({
  sectionResults,
  lessonReviewSections,
}: {
  sectionResults: LessonSectionResults;
  lessonReviewSections: Readonly<LessonReviewSection[]>;
}) =>
  lessonReviewSections.every((item) => sectionResults[item]?.isComplete)
    ? "review"
    : "overview";

/**
 * Extracts selected multiple-choice answers from submitted form data.
 *
 * @param params - The submitted form data and question answers.
 * @param params.formData - The submitted form data for the current question.
 * @param params.answers - The available multiple-choice answers for the question.
 * @returns The selected multiple-choice answers in the order they were submitted.
 */
export const getSelectedMultipleChoiceAnswers = ({
  formData,
  answers,
}: {
  formData: FormData;
  answers: NonNullable<QuizQuestion["answers"]>["multiple-choice"];
}) => {
  const selectedAnswers: MCAnswer[] = [];

  for (const entry of formData.entries()) {
    const index = Number((entry[1] as string).at(-1));
    const answer = answers?.[index];
    if (answer) {
      selectedAnswers.push(answer);
    }
  }

  return selectedAnswers;
};

/**
 * Grades the submitted form data for the current question.
 *
 * @param params - The current question and submitted form data.
 * @param params.currentQuestionData - The question being answered.
 * @param params.formData - The submitted form data for the question.
 * @returns The graded question state, or `null` when the question cannot be graded.
 */
export const gradeQuestionFromFormData = ({
  currentQuestionData,
  formData,
}: {
  currentQuestionData: QuestionsArray[number];
  formData: FormData;
}) => {
  switch (currentQuestionData.questionType) {
    case "multiple-choice": {
      const answers = currentQuestionData.answers?.["multiple-choice"];
      if (!answers) return null;

      return gradeMultipleChoiceQuestion({
        questionData: currentQuestionData,
        pupilAnswer: getSelectedMultipleChoiceAnswers({
          formData,
          answers,
        }),
      });
    }
    case "short-answer":
      return gradeShortAnswerQuestion({
        questionData: currentQuestionData,
        pupilAnswer: formData.get(
          `short-answer-${currentQuestionData.questionUid}`,
        ) as string,
      });
    case "order":
      return gradeOrderQuestion({
        questionData: currentQuestionData,
        pupilAnswers: formData
          .getAll(`order-${currentQuestionData.questionUid}`)
          .map(Number),
      });
    case "match":
      return gradeMatchQuestion({
        questionData: currentQuestionData,
        matches: formData
          .getAll(`match-${currentQuestionData.questionUid}-match`)
          .map(String),
        choices: formData
          .getAll(`match-${currentQuestionData.questionUid}-choice`)
          .map(String),
      });
    default:
      return null;
  }
};
