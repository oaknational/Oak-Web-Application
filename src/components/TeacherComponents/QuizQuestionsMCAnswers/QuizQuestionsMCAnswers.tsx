import { VisuallyHidden } from "react-aria";
import {
  OakTypography,
  OakFlex,
  OakIcon,
  OakBox,
  OakCodeRenderer,
} from "@oaknational/oak-components";

import QuizImage from "@/components/TeacherComponents/QuizImage";
import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import QuizImageAnswer from "@/components/TeacherComponents/QuizImageAnswer";
import Typography from "@/components/SharedComponents/Typography";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizQuestionsMCAnswers = (props: {
  answers: MCAnswer[];
  questionNumber: number;
}) => {
  const { answers, questionNumber } = props;

  const containsImages =
    answers.filter(
      (choice) =>
        choice.answer.filter((answerItem) => answerItem.type === "image")
          .length > 0,
    ).length > 0;

  return (
    <OakFlex
      $flexDirection={"column"}
      $alignItems={containsImages ? undefined : "start"}
      role="list"
      $gap={"spacing-8"}
    >
      {answers.map((choice, i) => {
        const imageAnswers = choice.answer.filter(
          (answerItem) => answerItem.type === "image",
        );
        const encloseAnswer = imageAnswers.length > 0;
        const imageAnswer =
          choice.answer.length === 1 && imageAnswers.length === 1;

        return (
          <OakFlex
            key={`q-${questionNumber}-answer-${i}`}
            $flexDirection={"column"}
            $gap={"spacing-8"}
            $alignItems={encloseAnswer ? "center" : "flex-start"}
            $borderStyle="solid"
            $borderColor="border-brand"
            $borderRadius={"border-radius-m"}
            role="listitem"
            $ph={encloseAnswer && !imageAnswer ? "spacing-12" : "spacing-0"}
            $pv={encloseAnswer && !imageAnswer ? "spacing-16" : "spacing-0"}
            $ba={
              encloseAnswer && !imageAnswer
                ? "border-solid-s"
                : "border-solid-none"
            }
            $maxWidth={encloseAnswer ? "spacing-480" : "100%"}
          >
            {choice.answer.map((answerItem, j) => {
              if (answerItem.type === "text" && !choice.answerIsCorrect) {
                return (
                  <Typography
                    key={`q-${questionNumber}-answer-element-${j}`}
                    $font={["body-2", "body-1"]}
                    $ph={40}
                  >
                    <OakCodeRenderer
                      string={removeMarkdown(answerItem.text)}
                      $font="code-3"
                      $mt={"spacing-0"}
                    />
                  </Typography>
                );
              } else if (answerItem.type === "text" && choice.answerIsCorrect) {
                return (
                  <OakFlex
                    key={`q-${questionNumber}-answer-element-${j}`}
                    $background={"bg-decorative5-subdued"}
                    $borderRadius="border-radius-m2"
                    $ph="spacing-8"
                    $alignItems={"center"}
                  >
                    <OakBox $minWidth="spacing-32" aria-hidden>
                      <OakIcon
                        iconName={"tick"}
                        $width={"spacing-24"}
                        $height={"spacing-24"}
                      />
                    </OakBox>
                    <VisuallyHidden>
                      Correct answer: {removeMarkdown(answerItem.text)}
                    </VisuallyHidden>
                    <OakTypography $font={["body-2", "body-1"]} aria-hidden>
                      <OakCodeRenderer
                        string={removeMarkdown(answerItem.text)}
                        $font="code-3"
                        $mt={"spacing-0"}
                      />
                    </OakTypography>
                  </OakFlex>
                );
              } else if (answerItem.type === "image") {
                return imageAnswer ? (
                  <QuizImageAnswer
                    key={`q-${questionNumber}-answer-element-${j}`}
                    src={answerItem.imageObject}
                    answerIsCorrect={choice.answerIsCorrect && imageAnswer}
                    alt="An image in a quiz"
                  />
                ) : (
                  <QuizImage
                    key={`q-${questionNumber}-answer-element-${j}`}
                    src={answerItem.imageObject}
                  />
                );
              }
            })}
          </OakFlex>
        );
      })}
    </OakFlex>
  );
};
