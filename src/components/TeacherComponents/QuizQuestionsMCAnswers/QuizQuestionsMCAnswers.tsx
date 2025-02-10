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
import Flex from "@/components/SharedComponents/Flex.deprecated";
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
    <Flex
      $flexDirection={"column"}
      $alignItems={containsImages ? undefined : "start"}
      role="list"
      $gap={8}
    >
      {answers.map((choice, i) => {
        const imageAnswers = choice.answer.filter(
          (answerItem) => answerItem.type === "image",
        );
        const encloseAnswer = imageAnswers.length > 0;
        const imageAnswer =
          choice.answer.length === 1 && imageAnswers.length === 1;

        return (
          <Flex
            key={`q-${questionNumber}-answer-${i}`}
            $flexDirection={"column"}
            $gap={8}
            $alignItems={encloseAnswer ? "center" : "flex-start"}
            $borderStyle="solid"
            $borderColor="black"
            $borderRadius={8}
            role="listitem"
            $ph={encloseAnswer && !imageAnswer ? 10 : 0}
            $pv={encloseAnswer && !imageAnswer ? 16 : 0}
            $ba={encloseAnswer && !imageAnswer ? 1 : 0}
            $maxWidth={encloseAnswer ? 450 : "100%"}
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
                      $mt={"space-between-none"}
                    />
                  </Typography>
                );
              } else if (answerItem.type === "text" && choice.answerIsCorrect) {
                return (
                  <OakFlex
                    key={`q-${questionNumber}-answer-element-${j}`}
                    $background={"lemon50"}
                    $borderRadius="border-radius-m2"
                    $ph="inner-padding-xs"
                    $alignItems={"center"}
                  >
                    <OakBox $minWidth="all-spacing-7" aria-hidden>
                      <OakIcon
                        iconName={"tick"}
                        $width={"all-spacing-6"}
                        $height={"all-spacing-6"}
                      />
                    </OakBox>
                    <VisuallyHidden>
                      Correct answer: {removeMarkdown(answerItem.text)}
                    </VisuallyHidden>

                    <OakTypography $font={["body-2", "body-1"]} aria-hidden>
                      <OakCodeRenderer
                        string={removeMarkdown(answerItem.text)}
                        $font="code-3"
                        $mt={"space-between-none"}
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
          </Flex>
        );
      })}
    </Flex>
  );
};
