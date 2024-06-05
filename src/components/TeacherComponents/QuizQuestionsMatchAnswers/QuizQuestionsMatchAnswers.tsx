import { VisuallyHidden } from "react-aria";
import { OakP, OakSpan, OakFlex } from "@oaknational/oak-components";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import Icon from "@/components/SharedComponents/Icon";
import { MatchAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizQuestionsMatchAnswers = ({
  answers,
  questionNumber,
}: {
  answers: MatchAnswer[];
  questionNumber: number;
}) => {
  return (
    <OakFlex
      $flexDirection={"column"}
      $gap="all-spacing-1"
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
            <OakFlex
              $ph="inner-padding-xs"
              $borderRadius="border-radius-m2"
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
                <OakP
                  $whiteSpace={"nowrap"}
                  $font={["body-2-bold", "body-1-bold"]}
                  aria-hidden
                >
                  {removeMarkdown(match_option.text)}
                  <OakSpan>{" -"}&nbsp;</OakSpan>
                </OakP>
                <OakP
                  $whiteSpace={["break-spaces", "nowrap"]}
                  $font={["body-2", "body-1"]}
                >
                  {removeMarkdown(correct_choice.text)}
                </OakP>
              </Flex>
            </OakFlex>
          )
        );
      })}
    </OakFlex>
  );
};
