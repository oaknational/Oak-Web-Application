import { removeMarkdown } from "../../../quizUtils";

import Box from "@/components/Box";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import Typography from "@/components/Typography";
import { MatchAnswer } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export const MatchAnswers = ({
  answers,
  questionNumber,
}: {
  answers: MatchAnswer[];
  questionNumber: number;
}) => {
  return (
    <Flex $flexDirection={"column"} $gap={4} $alignItems={"start"}>
      {answers.map((item, i) => {
        const match_option = item.match_option[0];
        const correct_choice = item.correct_choice[0];
        return (
          match_option &&
          correct_choice && (
            <Flex
              key={`q-${questionNumber}-answer${i}`}
              $background={"teachersPastelYellow"}
              $borderRadius={8}
              $ph={8}
              $alignItems={"center"}
              $gap={8}
            >
              <Box $minWidth={32}>
                <Icon name={"tick"} />
              </Box>

              <Typography $font={["body-2-bold", "body-1-bold"]}>
                {removeMarkdown(match_option.text)}
              </Typography>

              <Typography $font={["body-2", "body-1"]}>
                - {removeMarkdown(correct_choice.text)}
              </Typography>
            </Flex>
          )
        );
      })}
    </Flex>
  );
};
