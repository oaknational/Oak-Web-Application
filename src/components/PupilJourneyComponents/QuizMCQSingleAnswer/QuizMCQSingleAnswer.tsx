import {
  OakBox,
  OakRadioButton,
  OakRadioGroup,
} from "@oak-academy/oak-components";

import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export type QuizMCQSingleAnswerProps = {
  questionUid: string;
  answers: MCAnswer[];
  currentQuestionIndex: number;
  isFeedbackMode: boolean;
  selectedAnswer?: { answer?: MCAnswer | null; index: number };
  setSelectedAnswer: (val: { answer?: MCAnswer | null; index: number }) => void;
};

export const QuizMCQSingleAnswer = (props: QuizMCQSingleAnswerProps) => {
  const {
    questionUid,
    currentQuestionIndex,
    answers,
    isFeedbackMode,
    selectedAnswer,
    setSelectedAnswer,
  } = props;

  return (
    <OakRadioGroup
      name={questionUid || "quiz"}
      $flexDirection={"column"}
      onChange={(e) => {
        const targetIndex = e.target.tabIndex;
        const selectedAnswer = answers[targetIndex];
        setSelectedAnswer({
          answer: selectedAnswer,
          index: targetIndex,
        });
      }}
      disabled={isFeedbackMode}
    >
      {answers?.map((answer, i) => {
        return (
          <OakBox key={`radio-${i}`}>
            {answer.answer.map((answerItem) => {
              const isSelected = selectedAnswer?.index === i;
              const incorrectColor = isSelected ? "red" : undefined;

              const feedbackModeColor = answer.answer_is_correct
                ? "oakGreen"
                : incorrectColor;

              const backgroundColor = isFeedbackMode
                ? feedbackModeColor
                : undefined;

              const color = backgroundColor ? "text-inverted" : undefined;

              if (answerItem.type === "text") {
                return (
                  <OakRadioButton
                    key={`radio-${i}`}
                    $pa="inner-padding-s"
                    $ba={"border-solid-s"}
                    $borderRadius={"border-radius-s"}
                    $color={color}
                    $background={backgroundColor}
                    id={`radio-${i}`}
                    tabIndex={i}
                    value={`${currentQuestionIndex}${answerItem.text}`}
                    label={answerItem.text}
                  />
                );
              }
            })}
          </OakBox>
        );
      })}
    </OakRadioGroup>
  );
};
