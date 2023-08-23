import { VisuallyHidden } from "react-aria";

import { removeMarkdown } from "../../../quizUtils";

import Box from "@/components/Box";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import Typography from "@/components/Typography";
import { ShortAnswer } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export const ShortAnswers = ({
  answers,
  questionNumber,
}: {
  answers: ShortAnswer[];
  questionNumber: number;
}) => {
  return (
    <Flex $flexDirection={"column"} $gap={4} $alignItems={"start"}>
      {answers.map((item, i) => {
        const shortAnswer =
          item.answer && item.answer.length > 0 ? item.answer[0] : undefined;
        return (
          shortAnswer && (
            <Flex
              key={`q-${questionNumber}-answer${i}`}
              $background={"teachersPastelYellow"}
              $borderRadius={8}
              $ph={8}
              $alignItems={"center"}
              $gap={8}
            >
              <VisuallyHidden>
                Correct Answer: {removeMarkdown(shortAnswer.text)}
              </VisuallyHidden>

              <Box $minWidth={32} aria-hidden>
                <Icon name={"tick"} />
              </Box>

              <Typography $font={["body-2", "body-1"]} aria-hidden>
                {removeMarkdown(shortAnswer.text)}
              </Typography>
            </Flex>
          )
        );
      })}
    </Flex>
  );
};
