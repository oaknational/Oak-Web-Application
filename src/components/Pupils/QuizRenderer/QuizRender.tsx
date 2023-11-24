import { FC } from "react";
import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakTypography,
  OakRadioGroup,
  OakRadioButton,
} from "@oak-academy/oak-components";

import useQuizEngineContext from "../QuizEngineProvider/useQuizEngineContext";

import { QuestionStem } from "@/components/QuizContainerNew/QuestionsListNew/QuestionListItemNew/QuestionStem";

export const QuizRenderer: FC = () => {
  const quizContext = useQuizEngineContext();

  const {
    currentQuestionData,
    currentQuestionIndex,
    questionState,
    handleSubmitMCAnswer,
    handleNextQuestion,
  } = quizContext;

  const { questionStem, answers, questionUid } = currentQuestionData || {};

  return (
    <OakFlex
      $flexDirection={"column"}
      $color={"text-inverted"}
      $background={"lavender"}
    >
      <OakHeading tag="h1">Quiz Renderer</OakHeading>
      <OakTypography>mode: {questionState.mode}</OakTypography>
      <OakTypography>
        answer: {questionState.answer || "not answered"}
      </OakTypography>

      {questionState.mode === "end" ? (
        <OakFlex>
          <OakTypography>End of quiz</OakTypography>
        </OakFlex>
      ) : (
        <OakFlex $flexDirection={"column"}>
          <QuestionStem
            questionStem={questionStem || []}
            index={currentQuestionIndex}
            showIndex={true}
          />
          <OakRadioGroup
            name={questionUid || "quiz"}
            $flexDirection={"column"}
            onChange={(e) => {
              if (
                answers?.["multiple-choice"]?.[e.target.tabIndex] !==
                  undefined &&
                answers?.["multiple-choice"]?.[e.target.tabIndex] !== null
              ) {
                handleSubmitMCAnswer(
                  answers["multiple-choice"][e.target.tabIndex],
                );
              }
            }}
          >
            {answers?.["multiple-choice"]?.map((answer, i) => {
              return (
                <>
                  {answer.answer.map((answerItem) => {
                    if (answerItem.type === "text") {
                      return (
                        <OakRadioButton
                          tabIndex={i}
                          value={answerItem.text}
                          label={answerItem.text}
                        />
                      );
                    }
                  })}
                </>
              );
            })}
          </OakRadioGroup>
          <OakPrimaryButton
            disabled={questionState.mode === "input"}
            onClick={handleNextQuestion}
          >
            Submit
          </OakPrimaryButton>
        </OakFlex>
      )}
    </OakFlex>
  );
};
