import { VisuallyHidden } from "react-aria";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import Flex from "@/components/SharedComponents/Flex";
import Icon from "@/components/SharedComponents/Icon";
import { P, Span } from "@/components/SharedComponents/Typography";
import { MatchAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizQuestionsMatchAnswers = ({
  answers,
  questionNumber,
}: {
  answers: MatchAnswer[];
  questionNumber: number;
}) => {
  return (
    <Flex
      $flexDirection={"column"}
      $gap={4}
      $alignItems={"start"}
      role="list"
      $width={"100%"}
    >
      {answers.map((item, i) => {
        const match_option = item.match_option[0];
        const correct_choice = item.correct_choice[0];
        return (
          match_option &&
          correct_choice && (
            <Flex
              $ph={8}
              $borderRadius={8}
              role="listitem"
              key={`q-${questionNumber}-answer${i}`}
              $background={"lemon50"}
            >
              <VisuallyHidden>
                Correct Answer:
                {removeMarkdown(match_option.text)},
                {removeMarkdown(correct_choice.text)}
              </VisuallyHidden>
              <Icon $mr={8} name={"tick"} />
              <Flex $flexWrap={"wrap"} $width={["100%", "100%", "max-content"]}>
                <P
                  $whiteSpace={"nowrap"}
                  $font={["body-2-bold", "body-1-bold"]}
                  aria-hidden
                >
                  {removeMarkdown(match_option.text)}
                  <Span>{" -"}&nbsp;</Span>
                </P>
                <P
                  $whiteSpace={["break-spaces", "nowrap"]}
                  $font={["body-2", "body-1"]}
                >
                  {removeMarkdown(correct_choice.text)}
                </P>
              </Flex>
            </Flex>
          )
        );
      })}
    </Flex>
  );
};
