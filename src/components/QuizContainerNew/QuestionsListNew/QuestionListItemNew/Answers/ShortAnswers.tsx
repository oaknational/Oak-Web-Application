import { VisuallyHidden } from "react-aria";

import { removeMarkdown } from "../../../quizUtils";

import Box from "@/components/Box";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import Typography from "@/components/Typography";
import { ShortAnswer } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export const ShortAnswers = ({ answers }: { answers: ShortAnswer[] }) => {
  const answerString = answers.reduce((acc, cur) => {
    if (acc === "") {
      return (cur.answer && cur.answer[0] && cur.answer[0].text) || acc;
    }

    return cur.answer && cur.answer[0] && cur.answer[0].text
      ? `${acc}, ${cur.answer[0].text}`
      : acc;
  }, "");

  return (
    <Flex $flexDirection={"column"} $gap={4} $alignItems={"start"}>
      <Flex
        $background={"teachersPastelYellow"}
        $borderRadius={8}
        $ph={8}
        $alignItems={"center"}
        $gap={8}
      >
        <VisuallyHidden>
          Correct Answer: {removeMarkdown(answerString)}
        </VisuallyHidden>

        <Box $minWidth={32} aria-hidden>
          <Icon name={"tick"} />
        </Box>

        <Typography $font={["body-2", "body-1"]} aria-hidden>
          {removeMarkdown(answerString)}
        </Typography>
      </Flex>
    </Flex>
  );
};
