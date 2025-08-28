import { FormEvent } from "react";
import { OakBox, OakFlex } from "@oaknational/oak-components";

import { QuizAttribution } from "../QuizAttribution/QuizAttribution";

import type { MCAnswer } from "@/node-lib/curriculum-api-2023/queries/pupilLesson/pupilLesson.schema";
import { pickAnswerComponent } from "@/components/PupilComponents/QuizUtils/pickAnswerComponent";
import { useQuizEngineContext } from "@/components/PupilComponents/QuizEngineProvider";
import { QuizQuestionStem } from "@/components/PupilComponents/QuizQuestionStem";
import { MathJaxWrap } from "@/browser-lib/mathjax/MathJaxWrap";

type QuizRenderProps = {
  formId: string;
};

export const QuizRenderer = (props: QuizRenderProps) => {
  const { formId } = props;
  const quizEngineContext = useQuizEngineContext();

  const {
    currentQuestionData,
    currentQuestionIndex,
    questionState,
    updateQuestionMode,
    handleSubmitMCAnswer,
    handleSubmitShortAnswer,
    handleSubmitOrderAnswer,
    handleSubmitMatchAnswer,
  } = quizEngineContext;
  const currentQuestionState = questionState[currentQuestionIndex];
  let innerRender = null;

  if (currentQuestionData) {
    const { questionStem, answers } = currentQuestionData;

    const AnswerComponent = answers ? pickAnswerComponent(answers) : null;
    const answerRender = AnswerComponent ? (
      <AnswerComponent
        key={`question-index-${currentQuestionIndex}`}
        onChange={() => {
          updateQuestionMode("input");
        }}
      />
    ) : null;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // If the question has not been answered make it invalid
      // when attempting to submit an answer
      if (currentQuestionState?.mode === "init") {
        updateQuestionMode("incomplete");
        return;
      }

      // Don't allow an incomplete answer to be submitted
      if (currentQuestionState?.mode === "incomplete") {
        return;
      }

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
        case "order": {
          const answers = formData.getAll(
            `order-${currentQuestionData?.questionUid}`,
          );
          handleSubmitOrderAnswer(answers.map(Number));

          break;
        }
        case "match": {
          const matches = formData.getAll(
            `match-${currentQuestionData?.questionUid}-match`,
          );
          const choices = formData.getAll(
            `match-${currentQuestionData?.questionUid}-choice`,
          );
          handleSubmitMatchAnswer(matches.map(String), choices.map(String));

          break;
        }
        default:
          break;
      }
    };

    innerRender = (
      <OakBox
        as="form"
        id={formId}
        onSubmit={handleSubmit}
        $maxWidth={["100%", "all-spacing-22", "all-spacing-23"]}
        $minWidth={["100%", "all-spacing-21", "all-spacing-23"]}
        $ph={["inner-padding-m", "inner-padding-none", "inner-padding-xl"]}
        $height={"100%"}
      >
        <OakFlex
          $flexDirection={"column"}
          $gap={"space-between-m"}
          $height={"100%"}
        >
          <MathJaxWrap>
            {questionStem && (
              <QuizQuestionStem
                questionUid={currentQuestionData.questionUid}
                questionStem={questionStem}
                index={currentQuestionIndex}
                takeFullHeight={
                  currentQuestionData?.questionType === "explanatory-text"
                }
              />
            )}
            {answerRender}
          </MathJaxWrap>
          <QuizAttribution questionData={currentQuestionData} />
        </OakFlex>
      </OakBox>
    );
  }

  return (
    <OakFlex
      $flexDirection={"column"}
      $alignItems={"center"}
      $color="text-subdued"
      $pa={["inner-padding-none", "inner-padding-xl"]}
      $width={"100%"}
      $height={"100%"}
    >
      {innerRender}
    </OakFlex>
  );
};
