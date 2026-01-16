import { VisuallyHidden } from "react-aria";
import { OakFlex, OakIcon } from "@oaknational/oak-components";

import { removeMarkdown } from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import { MatchAnswer } from "@/node-lib/curriculum-api-2023/shared.schema";
import { Stem } from "@/components/SharedComponents/Stem";

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
              $background={"bg-decorative5-subdued"}
              $alignItems={"center"}
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
                $font={"body-1-bold"}
                $gap={"spacing-4"}
              >
                <Stem stem={matchOption} />-
                <Stem stem={correctChoice} />
              </OakFlex>
            </OakFlex>
          )
        );
      })}
    </OakFlex>
  );
};
