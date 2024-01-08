import { VisuallyHidden } from "react-aria";

import { removeMarkdown } from "@/components/QuizContainerNew/quizUtils";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import Icon from "@/components/Icon";
import Typography from "@/components/SharedComponents/Typography";
import { MatchAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export const MatchAnswers = ({
  answers,
  questionNumber,
}: {
  answers: MatchAnswer[];
  questionNumber: number;
}) => {
  return (
    <Flex $flexDirection={"column"} $gap={4} $alignItems={"start"} role="list">
      {answers.map((item, i) => {
        const match_option = item.match_option[0];
        const correct_choice = item.correct_choice[0];
        return (
          match_option &&
          correct_choice && (
            <Flex
              key={`q-${questionNumber}-answer${i}`}
              $background={"lemon50"}
              $borderRadius={8}
              $ph={8}
              $alignItems={"center"}
              $gap={8}
              role="listitem"
            >
              <VisuallyHidden>
                Correct Answer:
                {removeMarkdown(match_option.text)},
                {removeMarkdown(correct_choice.text)}
              </VisuallyHidden>

              <Box $minWidth={32} aria-hidden>
                <Icon name={"tick"} />
              </Box>

              <Typography $font={["body-2-bold", "body-1-bold"]} aria-hidden>
                {removeMarkdown(match_option.text)}
              </Typography>

              <Flex $gap={6}>
                <Typography $font={["body-2", "body-1"]} aria-hidden>
                  -
                </Typography>
                <Typography $font={["body-2", "body-1"]} aria-hidden>
                  {removeMarkdown(correct_choice.text)}
                </Typography>
              </Flex>
            </Flex>
          )
        );
      })}
    </Flex>
  );
};
