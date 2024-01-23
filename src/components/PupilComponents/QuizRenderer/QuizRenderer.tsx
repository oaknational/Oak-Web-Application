import { FormEvent } from "react";
import { OakFlex, OakForm } from "@oak-academy/oak-components";

import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";
import { pickAnswerComponent } from "@/components/PupilComponents/QuizUtils/pickAnswerComponent";
import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizQuestionStem } from "@/components/PupilComponents/QuizQuestionStem";

export const QuizRenderer = () => {
  const quizEngineContext = useQuizEngineContext();

  const {
    currentQuestionData,
    currentQuestionIndex,
    questionState,
    updateQuestionMode,
    handleSubmitMCAnswer,
    handleSubmitShortAnswer,
  } = quizEngineContext;

  let innerRender = null;

  const handleInitialChange = () => {
    if (questionState[currentQuestionIndex]?.mode === "init") {
      updateQuestionMode("input");
    }
  };

  if (currentQuestionData) {
    const { questionStem, answers } = currentQuestionData;

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
      <OakForm id="a-form" onSubmit={handleSubmit}>
        <OakFlex $flexDirection={"column"} $gap={"all-spacing-5"}>
          <QuizQuestionStem
            questionStem={questionStem}
            index={currentQuestionIndex}
            showIndex={true}
          />
          {answerRender}
        </OakFlex>
      </OakForm>
    );
  }

  return (
    <OakFlex
      $flexDirection={"column"}
      $color="text-subdued"
      $pa={"inner-padding-xl"}
      $alignItems={"center"}
      $gap={"all-spacing-5"}
      $width={"100%"}
    >
      {innerRender}
    </OakFlex>
  );
};
