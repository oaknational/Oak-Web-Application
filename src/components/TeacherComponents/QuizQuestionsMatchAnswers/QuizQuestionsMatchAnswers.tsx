import { VisuallyHidden } from "react-aria";
import {
  OakP,
  OakSpan,
  OakFlex,
  OakIcon,
  OakCodeRenderer,
} from "@oaknational/oak-components";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
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
      $gap="spacing-4"
      $alignItems={"start"}
      role="list"
      $width={"100%"}
    >
      {answers.map((item, i) => {
        const matchOption = item.matchOption[0];
        const correctChoice = item.correctChoice[0];
        return (
          matchOption &&
          correctChoice && (
            <OakFlex
              $ph="spacing-8"
              $borderRadius="border-radius-m2"
              role="listitem"
              key={`q-${questionNumber}-answer${i}`}
              $background={"lemon50"}
            >
              <VisuallyHidden>
                Correct Answer:
                {removeMarkdown(matchOption.text)},
                {removeMarkdown(correctChoice.text)}
              </VisuallyHidden>
              <OakIcon
                $mr={"spacing-8"}
                iconName={"tick"}
                $width={"spacing-24"}
                $height={"spacing-24"}
              />
              <OakFlex
                $flexWrap={"wrap"}
                $width={["100%", "100%", "max-content"]}
              >
                <OakP
                  $whiteSpace={"nowrap"}
                  $font={["body-2-bold", "body-1-bold"]}
                  aria-hidden
                >
                  <OakCodeRenderer
                    string={removeMarkdown(matchOption.text)}
                    $font="code-3"
                    $mt={"spacing-0"}
                  />
                  <OakSpan>{" -"}&nbsp;</OakSpan>
                </OakP>
                <OakP
                  $whiteSpace={["break-spaces", "nowrap"]}
                  $font={["body-2", "body-1"]}
                >
                  <OakCodeRenderer
                    string={removeMarkdown(correctChoice.text)}
                    $font="code-3"
                    $mt={"spacing-0"}
                  />
                </OakP>
              </OakFlex>
            </OakFlex>
          )
        );
      })}
    </OakFlex>
  );
};
