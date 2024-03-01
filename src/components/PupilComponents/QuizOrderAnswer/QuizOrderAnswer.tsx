import {
  OakFlex,
  OakQuizOrder,
  OakQuizOrderProps,
} from "@oaknational/oak-components";
import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { useInitialChange } from "@/components/PupilComponents/QuizUtils/useInitialChange";

export type QuizOrderAnswerProps = {
  onInitialChange?: () => void;
  onChange?: () => void;
};

export const QuizOrderAnswer = (props: QuizOrderAnswerProps) => {
  const { onInitialChange, onChange } = props;

  const quizEngineContext = useQuizEngineContext();
  const { currentQuestionIndex, currentQuestionData } = quizEngineContext;
  const questionState = quizEngineContext?.questionState[currentQuestionIndex];
  // const questionUid = currentQuestionData?.questionUid;

  console.log("currentQuestionData", currentQuestionData);

  const { handleOnChange } = useInitialChange({ onChange, onInitialChange });

  if (!questionState || !currentQuestionData) {
    return null;
  }

  let initialItems = [] as OakQuizOrderProps["initialItems"];

  if (currentQuestionData?.answers) {
    const answers = currentQuestionData.answers;
    if (answers["order"]) {
      const order = answers["order"];
      initialItems = order.map((item, index) => {
        return {
          id: index.toString(),
          label:
            item["answer"][0] && item["answer"][0]["type"] === "text"
              ? item["answer"][0]["text"]
              : "",
        };
      });
    }
  }

  // const feedback =
  //   questionState.mode === "feedback" &&
  //   typeof questionState.feedback === "string"
  //     ? questionState.feedback
  //     : undefined;

  return (
    <OakFlex
      $flexDirection={"column"}
      $gap={"space-between-m"}
      $font={"body-1"}
    >
      <OakQuizOrder initialItems={initialItems} onChange={handleOnChange} />
    </OakFlex>
  );
};
