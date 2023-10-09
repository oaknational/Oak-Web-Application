import { VisuallyHidden } from "react-aria";

import QuizImage from "../QuizImage";
import { removeMarkdown } from "../../../quizUtils";
import QuizImageAnswer from "../QuizImageAnswer";

import Box from "@/components/Box";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import Typography from "@/components/Typography";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export const MCAnswers = (props: {
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
              if (answerItem.type === "text" && !choice.answer_is_correct) {
                return (
                  <Typography
                    key={`q-${questionNumber}-answer-element-${j}`}
                    $font={["body-2", "body-1"]}
                    $ph={40}
                  >
                    {removeMarkdown(answerItem.text)}
                  </Typography>
                );
              } else if (
                answerItem.type === "text" &&
                choice.answer_is_correct
              ) {
                return (
                  <Flex
                    key={`q-${questionNumber}-answer-element-${j}`}
                    $background={"teachersPastelYellow"}
                    $borderRadius={8}
                    $ph={8}
                    $alignItems={"center"}
                  >
                    <Box $minWidth={32} aria-hidden>
                      <Icon name={"tick"} />
                    </Box>
                    <VisuallyHidden>
                      Correct answer: {removeMarkdown(answerItem.text)}
                    </VisuallyHidden>

                    <Typography $font={["body-2", "body-1"]} aria-hidden>
                      {removeMarkdown(answerItem.text)}
                    </Typography>
                  </Flex>
                );
              } else if (answerItem.type === "image") {
                return imageAnswer ? (
                  <QuizImageAnswer
                    key={`q-${questionNumber}-answer-element-${j}`}
                    src={answerItem.image_object}
                    answerIsCorrect={choice.answer_is_correct && imageAnswer}
                  />
                ) : (
                  <QuizImage
                    key={`q-${questionNumber}-answer-element-${j}`}
                    src={answerItem.image_object}
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
