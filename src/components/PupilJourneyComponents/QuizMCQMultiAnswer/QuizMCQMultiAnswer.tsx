import { OakFlex, OakQuizCheckBox } from "@oak-academy/oak-components";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export type QuizMCQMultiAnswerProps = {
  questionUid: string;
  answers: MCAnswer[];
  isFeedbackMode: boolean;
  feedback?: boolean[];
};

export const QuizMCQMultiAnswer = (props: QuizMCQMultiAnswerProps) => {
  const {
    questionUid,
    answers,
    // currentQuestionIndex,
    isFeedbackMode,
    feedback,
    // selectedAnswer,
    // setSelectedAnswer,
  } = props;

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
