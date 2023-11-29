import { useContext, useState } from "react";
import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakTypography,
  OakRadioGroup,
  OakRadioButton,
} from "@oak-academy/oak-components";

import { quizEngineContext } from "../QuizEngineProvider/QuizEngineProvider";
import { QuestionStem } from "../QuestionStem.tsx";

import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizRenderer = () => {
  const quizContext = useContext(quizEngineContext);

  const [selectedAnswer, setSelectedAnswer] = useState<{
    answer: MCAnswer | null | undefined;
    index: number;
  }>();

  const {
    currentQuestionData,
    currentQuestionIndex,
    questionState,
    handleSubmitMCAnswer,
    handleNextQuestion,
  } = quizContext;

  if (!currentQuestionData) {
    return null;
  }

  const { questionStem, answers, questionUid } = currentQuestionData;

  return (
    <OakFlex
      $flexDirection={"column"}
      $color={"text-inverted"}
      $background={"lavender"}
      $alignItems={["center", "start"]}
    >
      <OakHeading tag="h1">Quiz Renderer</OakHeading>
      <OakTypography>mode: {questionState.mode}</OakTypography>
      <OakTypography>
        answer: {questionState.answer || "not answered"}
      </OakTypography>

      {questionState.mode === "end" ? (
        <OakFlex>
          <OakTypography>
            End of quiz, score: {questionState.score}/
            {questionState.maximumScore}
          </OakTypography>
        </OakFlex>
      ) : (
        <OakFlex $flexDirection={"column"}>
          <QuestionStem
            questionStem={questionStem || []}
            index={currentQuestionIndex}
            showIndex={true}
            data-testid="question-stem"
          />
          <OakRadioGroup
            name={questionUid || "quiz"}
            $flexDirection={"column"}
            onChange={(e) => {
              if (
                answers?.["multiple-choice"]?.[e.target.tabIndex] !==
                  undefined &&
                answers?.["multiple-choice"]?.[e.target.tabIndex] !== null &&
                questionState.mode === "input"
              ) {
                setSelectedAnswer({
                  answer: answers["multiple-choice"][e.target.tabIndex],
                  index: e.target.tabIndex,
                });
              }
            }}
          >
            {answers?.["multiple-choice"]?.map((answer, i) => {
              return (
                <OakFlex key={i}>
                  {answer.answer.map((answerItem) => {
                    if (answerItem.type === "text") {
                      return (
                        <OakRadioButton
                          key={`radio-${i}`}
                          tabIndex={i}
                          value={`${currentQuestionIndex}${answerItem.text}`}
                          label={answerItem.text}
                          $background={
                            questionState.mode === "feedback"
                              ? answer.answer_is_correct === true
                                ? "oakGreen"
                                : selectedAnswer?.index === i
                                ? "red"
                                : "lavender"
                              : "lavender"
                          }
                        />
                      );
                    }
                  })}
                </OakFlex>
              );
            })}
          </OakRadioGroup>
          {questionState.mode !== "feedback" && (
            <OakPrimaryButton
              disabled={selectedAnswer === undefined}
              onClick={() => {
                handleSubmitMCAnswer(selectedAnswer?.answer);
              }}
            >
              Submit
            </OakPrimaryButton>
          )}
          {questionState.mode === "feedback" && (
            <OakPrimaryButton
              disabled={questionState.mode !== "feedback"}
              onClick={() => {
                handleNextQuestion();
                setSelectedAnswer(undefined);
              }}
            >
              Next Question
            </OakPrimaryButton>
          )}
        </OakFlex>
      )}
    </OakFlex>
  );
};
