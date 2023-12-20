import { OakFlex, OakQuizCheckBox } from "@oak-academy/oak-components";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export type QuizMCQMultiAnswerProps = {
  questionUid: string;
  answers: MCAnswer[];
  currentQuestionIndex: number;
  isFeedbackMode: boolean;
  // selectedAnswer?: { answer?: MCAnswer | null; index: number };
  // setSelectedAnswer: (val: { answer?: MCAnswer | null; index: number }) => void;
};

export const QuizMCQMultiAnswer = (props: QuizMCQMultiAnswerProps) => {
  const {
    questionUid,
    answers,
    // currentQuestionIndex,
    isFeedbackMode,
    // selectedAnswer,
    // setSelectedAnswer,
  } = props;

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      {answers.map((answer, index) => (
        <OakQuizCheckBox
          id={`${questionUid}-answer${index}`}
          value={answer.answer[0].text}
          isFeedback={isFeedbackMode}
        />
      ))}
    </OakFlex>
  );
};
