import QuizImage from "../QuizImage";
import { removeMarkdown } from "../../../quizUtils";

import Box from "@/components/Box";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import Typography from "@/components/Typography";
import { MCAnswer } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export const MCAnswers = (props: {
  answers: MCAnswer[];
  questionNumber: number;
}) => {
  const { answers, questionNumber } = props;

  const containsImages =
    answers.filter(
      (choice) =>
        choice.answer.filter((answerItem) => answerItem.type === "image")
          .length > 0
    ).length > 0;

  return (
    <Flex
      $flexDirection={"column"}
      $alignItems={containsImages ? undefined : "start"}
    >
      {answers.map((choice, i) => {
        const encloseAnswer =
          choice.answer.filter((answerItem) => answerItem.type === "image")
            .length > 0;
        return (
          <Flex
            key={`q-${questionNumber}-answer-${i}`}
            $flexDirection={"column"}
            $gap={8}
            $alignItems={encloseAnswer ? "center" : "flex-start"}
            $ph={encloseAnswer ? 10 : 0}
            $pv={encloseAnswer ? 16 : 0}
            $ba={encloseAnswer ? 1 : 0}
            $mb={encloseAnswer ? 8 : 0}
            $maxWidth={encloseAnswer ? 450 : "100%"}
            $borderStyle="solid"
            $borderColor="black"
            $borderRadius={8}
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
                    <Box $minWidth={32}>
                      <Icon name={"tick"} />
                    </Box>

                    <Typography $font={["body-2", "body-1"]}>
                      {removeMarkdown(answerItem.text)}
                    </Typography>
                  </Flex>
                );
              } else if (answerItem.type === "image") {
                return (
                  <QuizImage
                    key={`q-${questionNumber}-answer-element-${j}`}
                    src={answerItem.image_object}
                    alt="An image supporting the question"
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
