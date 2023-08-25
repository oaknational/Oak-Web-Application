import { VisuallyHidden } from "react-aria";

import { removeMarkdown } from "../../../quizUtils";

import Box from "@/components/Box";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import Typography from "@/components/Typography";
import { OrderAnswer } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export const OrderAnswers = ({
  answers,
  questionNumber,
}: {
  answers: OrderAnswer[];
  questionNumber: number;
}) => {
  return (
    <Flex $flexDirection={"column"} $gap={4} $alignItems={"start"} role="list">
      {answers.map((item, i) => {
        const orderAnswer =
          item.answer && item.answer.length > 0 ? item.answer[0] : undefined;
        return (
          orderAnswer && (
            <Flex
              key={`q-${questionNumber}-answer${i}`}
              $background={"teachersPastelYellow"}
              $borderRadius={8}
              $ph={8}
              $alignItems={"center"}
              $gap={8}
              role="listitem"
            >
              <VisuallyHidden>
                {item.correct_order} - {removeMarkdown(orderAnswer.text)}
              </VisuallyHidden>
              <Box $minWidth={32} aria-hidden>
                <Icon name={"tick"} />
              </Box>

              <Typography $font={["body-2-bold", "body-1-bold"]} aria-hidden>
                {item.correct_order}
              </Typography>

              <Typography $font={["body-2", "body-1"]} aria-hidden>
                - {removeMarkdown(orderAnswer.text)}
              </Typography>
            </Flex>
          )
        );
      })}
    </Flex>
  );
};
