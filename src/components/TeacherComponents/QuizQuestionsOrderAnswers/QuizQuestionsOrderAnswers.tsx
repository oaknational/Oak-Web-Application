import { VisuallyHidden } from "react-aria";
import { OakTypography } from "@oaknational/oak-components";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import Icon from "@/components/SharedComponents/Icon";
import { OrderAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizQuestionsOrderAnswers = ({
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
              $background={"lemon50"}
              $borderRadius={8}
              $ph={8}
              $alignItems={"flex-start"}
              $gap={8}
              role="listitem"
            >
              <VisuallyHidden>
                {item.correct_order} - {removeMarkdown(orderAnswer.text)}
              </VisuallyHidden>
              <Box $minWidth={32} aria-hidden>
                <Icon name={"tick"} />
              </Box>

              <OakTypography $font={["body-2-bold", "body-1-bold"]} aria-hidden>
                {item.correct_order}
              </OakTypography>

              <OakTypography $font={["body-2", "body-1"]} aria-hidden>
                - {removeMarkdown(orderAnswer.text)}
              </OakTypography>
            </Flex>
          )
        );
      })}
    </Flex>
  );
};
