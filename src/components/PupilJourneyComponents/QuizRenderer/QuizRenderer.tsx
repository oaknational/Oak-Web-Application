import { FormEvent } from "react";
import {
  OakFlex,
  OakForm,
  OakHeading,
  OakPrimaryButton,
  OakSpan,
} from "@oak-academy/oak-components";

import { useQuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { QuizQuestionStem } from "@/components/PupilJourneyComponents/QuizQuestionStem";
import { QuizMCQSingleAnswer } from "@/components/PupilJourneyComponents/QuizMCQSingleAnswer/QuizMCQSingleAnswer";
import { QuizMCQMultiAnswer } from "@/components/PupilJourneyComponents/QuizMCQMultiAnswer/QuizMCQMultiAnswer";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

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

    const MCAnswers = answers?.["multiple-choice"];
    const isFeedbackMode =
      questionState[currentQuestionIndex]?.mode === "feedback";

    let answerRender = null;

    const handleInitialChange = () => {
      if (questionState[currentQuestionIndex]?.mode === "init") {
        updateQuestionMode("input");
      }
    };

    if (MCAnswers) {
      if (MCAnswers.filter((a) => a.answer_is_correct).length > 1) {
        answerRender = (
          <QuizMCQMultiAnswer
            key={`mcq-index-${currentQuestionIndex}`}
            onInitialChange={handleInitialChange}
          />
        );
      } else {
        answerRender = (
          <QuizMCQSingleAnswer
            key={`mcq-index-${currentQuestionIndex}`}
            onInitialChange={handleInitialChange}
          />
        );
      }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      updateQuestionMode("grading");
      const formData = new FormData(e.currentTarget);

      switch (currentQuestionData.questionType) {
        case "multiple-choice": {
          const selectedAnswers: MCAnswer[] = [];
          const answers = currentQuestionData?.answers?.["multiple-choice"];

          for (const entries of formData.entries()) {
            const index = Number((entries[1] as string).at(-1)); // assumes the last character is the index and no more than 10 answers
            answers?.[index] && selectedAnswers.push(answers[index]!); // FIXME: not sure why typescript doesn't recognize the null check
          }
          handleSubmitMCAnswer(selectedAnswers);
          break;
        }
        case "short-answer":
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
