import { useContext } from "react";
import { OakFlex, OakQuizCheckBox } from "@oak-academy/oak-components";

import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";
import { QuizEngineContext } from "@/components/PupilJourneyComponents/QuizEngineProvider";

export type QuizMCQMultiAnswerProps = {
  questionUid: string;
  answers: MCAnswer[];
  isFeedbackMode: boolean;
};

export const QuizMCQMultiAnswer = (props: QuizMCQMultiAnswerProps) => {
  const { questionUid, answers, isFeedbackMode } = props;

  const quizEngine = useContext(QuizEngineContext);

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      {answers.map((answer, index) => {
        const a = answer.answer[0];
        const isCorrect = feedback ? feedback[index] : false;
        return (
          <OakQuizCheckBox
            key={`${questionUid}-answer${index}`}
            id={`${questionUid}-answer${index}`}
            value={a.text}
            isFeedback={isFeedbackMode}
            isCorrect={isCorrect}
          />
        );
      })}
    </OakFlex>
  );
};
