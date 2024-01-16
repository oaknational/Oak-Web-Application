import { FormEvent } from "react";
import {
  OakFlex,
  OakForm,
  OakHeading,
  OakPrimaryButton,
  OakSpan,
} from "@oak-academy/oak-components";

import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";
<<<<<<< HEAD:src/components/PupilComponents/QuizRenderer/QuizRenderer.tsx
import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizQuestionStem } from "@/components/PupilComponents/QuizQuestionStem";
import { QuizMCQSingleAnswer } from "@/components/PupilComponents/QuizMCQSingleAnswer/QuizMCQSingleAnswer";
import { QuizMCQMultiAnswer } from "@/components/PupilComponents/QuizMCQMultiAnswer/QuizMCQMultiAnswer";
import { QuizShortAnswer } from "@/components/PupilComponents/QuizShortAnswer";
=======
import { pickAnswerComponent } from "@/components/PupilJourneyComponents/QuizUtils/pickAnswerComponent";
import { useQuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { QuizQuestionStem } from "@/components/PupilJourneyComponents/QuizQuestionStem";
>>>>>>> main:src/components/PupilJourneyComponents/QuizRenderer/QuizRenderer.tsx

export const QuizRenderer = () => {
  const quizEngineContext = useQuizEngineContext();

  const {
    currentQuestionData,
    currentQuestionIndex,
    questionState,
    isComplete,
    score,
    maxScore,
    handleNextQuestion,
    updateQuestionMode,
    handleSubmitMCAnswer,
    handleSubmitShortAnswer,
  } = quizEngineContext;

  let innerRender = null;

  let questionFeedback = null;

  if (isComplete) {
    innerRender = (
      <OakFlex>
        <OakSpan>
          End of quiz, score: {score}/{maxScore}
        </OakSpan>
      </OakFlex>
    );
  } else if (currentQuestionData) {
    const { questionStem, answers } = currentQuestionData;

    const isFeedbackMode =
      questionState[currentQuestionIndex]?.mode === "feedback";

    const handleInitialChange = () => {
      if (questionState[currentQuestionIndex]?.mode === "init") {
        updateQuestionMode("input");
      }
    };

    const AnswerComponent = answers ? pickAnswerComponent(answers) : null;
    const answerRender = AnswerComponent ? (
      <AnswerComponent
        key={`question-index-${currentQuestionIndex}`}
        onInitialChange={handleInitialChange}
      />
    ) : null;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      updateQuestionMode("grading");
      const formData = new FormData(e.currentTarget);

      switch (currentQuestionData.questionType) {
        case "multiple-choice": {
          const selectedAnswers: MCAnswer[] = [];
          if (!answers?.["multiple-choice"]) {
            return;
          }

          for (const entries of formData.entries()) {
            const i = Number((entries[1] as string).at(-1)); // assumes the last character is the index and no more than 10 answers
            const a = answers?.["multiple-choice"]?.[i];
            a && selectedAnswers.push(a);
          }
          handleSubmitMCAnswer(selectedAnswers);
          break;
        }
        case "short-answer": {
          const answer = formData.get(
            `short-answer-${currentQuestionData?.questionUid}`,
          ) as string;
          handleSubmitShortAnswer(answer);
          break;
        }
        case "order":
        case "match":
        default:
          break;
      }
    };

    innerRender = (
      <OakForm onSubmit={handleSubmit}>
        <OakFlex $flexDirection={"column"} $gap={"all-spacing-5"}>
          <QuizQuestionStem
            questionStem={questionStem}
            index={currentQuestionIndex}
            showIndex={true}
          />
          {answerRender}
          {!isFeedbackMode && (
            <OakFlex $pt="inner-padding-l">
              <OakPrimaryButton
                disabled={questionState[currentQuestionIndex]?.mode === "init"}
                type="submit"
              >
                Submit
              </OakPrimaryButton>
            </OakFlex>
          )}
          {isFeedbackMode && (
            <OakFlex $pt="inner-padding-l">
              <OakPrimaryButton onClick={handleNextQuestion}>
                Next Question
              </OakPrimaryButton>
            </OakFlex>
          )}
        </OakFlex>
      </OakForm>
    );

    questionFeedback = (
      <OakFlex
        $position={"absolute"}
        $left={"space-between-m"}
        $flexDirection={"column"}
        $gap={"space-between-ssx"}
      >
        <OakSpan>mode: {questionState[currentQuestionIndex]?.mode}</OakSpan>
        <OakSpan>
          feedback:
          {questionState[currentQuestionIndex]?.grade === 1
            ? "correct"
            : "incorrect"}
        </OakSpan>
      </OakFlex>
    );
  }

  return (
    <OakFlex
      $flexDirection={"column"}
      $color="text-subdued"
      $minWidth={"all-spacing-24"}
      $pa={"inner-padding-xl"}
      $ba="border-solid-m"
      $borderColor={"border-inverted"}
      $background={"bg-decorative1-very-subdued"}
      $alignItems={"center"}
      $gap={"all-spacing-5"}
    >
      <OakHeading tag="h1">Quiz Renderer</OakHeading>
      {questionFeedback}
      {innerRender}
    </OakFlex>
  );
};
