import {
  MCAnswer,
  QuizQuestion,
} from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import {
  isMatchAnswer,
  isOrderAnswer,
} from "@/components/PupilComponents/QuizUtils/answerTypeDiscriminators";
import {
  QuestionFeedbackType,
  QuestionState,
} from "@/components/PupilComponents/QuizUtils/questionTypes";
import { invariant } from "@/utils/invariant";
import {
  isImage,
  isText,
} from "@/components/PupilComponents/QuizUtils/stemUtils";

type GradedQuestionState = Pick<
  QuestionState,
  | "mode"
  | "grade"
  | "feedback"
  | "correctAnswer"
  | "pupilAnswer"
  | "isPartiallyCorrect"
>;

/**
 * Grades a multiple-choice question.
 *
 * @param params - The question data and submitted answer.
 * @param params.questionData - The quiz question being graded.
 * @param params.pupilAnswer - The submitted answer or answers.
 * @returns The persisted question state for feedback mode.
 */
export const gradeMultipleChoiceQuestion = ({
  questionData,
  pupilAnswer,
}: {
  questionData: QuizQuestion;
  pupilAnswer?: MCAnswer | MCAnswer[] | null;
}): GradedQuestionState => {
  const questionAnswers = questionData.answers?.["multiple-choice"];
  const correctAnswers = questionAnswers?.filter(
    (answer) => answer?.answerIsCorrect,
  );
  const pupilAnswerArray = Array.isArray(pupilAnswer)
    ? pupilAnswer
    : [pupilAnswer];
  const pupilAnswerIndexes = pupilAnswerArray.map((answer) =>
    questionAnswers?.findIndex((questionAnswer) => questionAnswer === answer),
  );

  const feedback = questionAnswers?.map((answer) => {
    if (pupilAnswerArray.includes(answer)) {
      return correctAnswers?.includes(answer) ? "correct" : "incorrect";
    }

    return correctAnswers?.includes(answer) ? "incorrect" : "correct";
  });

  const grade = !feedback?.includes("incorrect") ? 1 : 0;
  const isPartiallyCorrect =
    (grade === 0 &&
      questionData.answers?.["multiple-choice"]?.some(
        (answer, index) =>
          answer?.answerIsCorrect && feedback?.[index] === "correct",
      )) ??
    false;

  const correctAnswer = correctAnswers
    ?.map((answer) => {
      const textAnswer = answer.answer?.find(isText)?.text;
      const imageAnswer = answer.answer?.find(isImage);

      return textAnswer ?? imageAnswer;
    })
    .filter((answer) => answer !== undefined);

  return {
    mode: "feedback",
    grade,
    feedback,
    isPartiallyCorrect,
    pupilAnswer: pupilAnswerIndexes,
    correctAnswer,
  };
};

/**
 * Grades a short-answer question using trimmed, case-insensitive comparison.
 *
 * @param params - The question data and submitted answer.
 * @param params.questionData - The quiz question being graded.
 * @param params.pupilAnswer - The submitted short answer.
 * @returns The persisted question state for feedback mode.
 */
export const gradeShortAnswerQuestion = ({
  questionData,
  pupilAnswer,
}: {
  questionData: QuizQuestion;
  pupilAnswer?: string;
}): GradedQuestionState => {
  const questionAnswers = questionData.answers?.["short-answer"];
  const trimmedAnswer = pupilAnswer?.trim().toLowerCase() ?? "";
  const correctAnswers = questionAnswers
    ?.map((answer) =>
      answer?.answer?.[0]?.type === "text" ? answer.answer[0].text : null,
    )
    .filter((answer) => answer !== null);
  const trimmedAnswers = correctAnswers?.map((answer) =>
    answer.trim().toLowerCase(),
  );

  const feedback: QuestionFeedbackType = trimmedAnswers?.includes(trimmedAnswer)
    ? "correct"
    : "incorrect";

  return {
    mode: "feedback",
    grade: feedback === "correct" ? 1 : 0,
    feedback,
    pupilAnswer,
    correctAnswer: correctAnswers,
  };
};

/**
 * Grades an order question by comparing each submitted position with the correct order.
 *
 * @param params - The question data and submitted answers.
 * @param params.questionData - The quiz question being graded.
 * @param params.pupilAnswers - The submitted positions for each answer.
 * @returns The persisted question state for feedback mode.
 */
export const gradeOrderQuestion = ({
  questionData,
  pupilAnswers,
}: {
  questionData: QuizQuestion;
  pupilAnswers: number[];
}): GradedQuestionState => {
  const answers = questionData.answers;

  invariant(
    answers && isOrderAnswer(answers),
    "answers are not for an order question",
  );

  const sortedAnswers = [...answers.order]
    .sort((a, b) => (a.correctOrder ?? 0) - (b.correctOrder ?? 0))
    .map((answer) => answer.answer?.[0]?.text)
    .filter((answer) => answer !== undefined);

  const feedback: QuestionFeedbackType[] = pupilAnswers.map((pupilAnswer, i) =>
    pupilAnswer === i + 1 ? "correct" : "incorrect",
  );
  const isCorrect = feedback.every((item) => item === "correct");
  const isPartiallyCorrect =
    !isCorrect && feedback.some((item) => item === "correct");

  return {
    mode: "feedback",
    grade: isCorrect ? 1 : 0,
    feedback,
    isPartiallyCorrect,
    pupilAnswer: pupilAnswers,
    correctAnswer: sortedAnswers,
  };
};

/**
 * Grades a match question by comparing each selected choice against its correct slot.
 *
 * @param params - The question data and submitted answers.
 * @param params.questionData - The quiz question being graded.
 * @param params.matches - The correct match identifiers for each slot.
 * @param params.choices - The submitted choice identifiers for each slot.
 * @returns The persisted question state for feedback mode.
 */
export const gradeMatchQuestion = ({
  questionData,
  matches,
  choices,
}: {
  questionData: QuizQuestion;
  matches: string[];
  choices: string[];
}): GradedQuestionState => {
  const feedback: QuestionFeedbackType[] = matches.map((matchId, i) =>
    choices[i] === matchId ? "correct" : "incorrect",
  );
  const isCorrect = feedback.every((item) => item === "correct");
  const isPartiallyCorrect =
    !isCorrect && feedback.some((item) => item === "correct");
  const answers = questionData.answers;

  invariant(
    answers && isMatchAnswer(answers),
    "answers are not for a match question",
  );

  const correctAnswer = matches
    .map((matchId) => answers.match[Number(matchId)]?.correctChoice)
    .map((answer) => answer?.find(isText)?.text ?? "");

  return {
    mode: "feedback",
    grade: isCorrect ? 1 : 0,
    feedback,
    isPartiallyCorrect,
    pupilAnswer: choices,
    correctAnswer,
  };
};
