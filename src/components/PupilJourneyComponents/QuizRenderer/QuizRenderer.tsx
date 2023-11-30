import { useContext, useMemo, useState } from "react";
import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakRadioGroup,
  OakRadioButton,
  OakSpan,
} from "@oak-academy/oak-components";

import { quizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";
import { QuestionStem } from "@/components/PupilJourneyComponents/QuestionStem";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizRenderer = () => {
  const quizContext = useContext(quizEngineContext);
  const processedQuizContext = useMemo(() => {
    return quizContext;
  }, [quizContext]);
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
  } = processedQuizContext;

  if (!currentQuestionData) {
    return null;
  }

  const { questionStem, answers, questionUid } = currentQuestionData;

  const MCAnswers = answers?.["multiple-choice"];
  const isFeedbackMode = questionState.mode === "feedback";
  const isEndMode = questionState.mode === "end";
  const isInputMode = questionState.mode === "input";

  return (
    <OakFlex
      $flexDirection={"column"}
      $color={"text-inverted"}
      $background={"lavender"}
      $alignItems={["center", "start"]}
    >
      <OakHeading tag="h1">Quiz Renderer</OakHeading>
      <OakSpan>mode: {questionState.mode}</OakSpan>
      <OakSpan>answer: {questionState.answer || "not answered"}</OakSpan>
      {isEndMode && (
        <OakFlex>
          <OakSpan>
            End of quiz, score: {questionState.score}/
            {questionState.maximumScore}
          </OakSpan>
        </OakFlex>
      )}
      {(isInputMode || isFeedbackMode) && (
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
              const targetIndex = e.target.tabIndex;
              const selectedAnswer = MCAnswers?.[targetIndex];
              setSelectedAnswer({
                answer: selectedAnswer,
                index: targetIndex,
              });
            }}
          >
            {MCAnswers?.map((answer, i) => {
              return (
                <OakFlex key={i}>
                  {answer.answer.map((answerItem) => {
                    const isCorrectAnswer = answer.answer_is_correct === true;
                    const isIncorrectAndSelected =
                      selectedAnswer?.index === i && !isCorrectAnswer;
                    const isTextType = answerItem.type === "text";
                    if (isTextType) {
                      return (
                        <OakRadioButton
                          id={`radio-${i}`}
                          key={`radio-${i}`}
                          tabIndex={i}
                          value={`${currentQuestionIndex}${answerItem.text}`}
                          label={answerItem.text}
                          $background={
                            isFeedbackMode
                              ? isCorrectAnswer
                                ? "oakGreen"
                                : isIncorrectAndSelected
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
          {isInputMode && (
            <OakPrimaryButton
              disabled={selectedAnswer === undefined}
              onClick={() => {
                handleSubmitMCAnswer(selectedAnswer?.answer);
              }}
            >
              Submit
            </OakPrimaryButton>
          )}
          {isFeedbackMode && (
            <OakPrimaryButton
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
