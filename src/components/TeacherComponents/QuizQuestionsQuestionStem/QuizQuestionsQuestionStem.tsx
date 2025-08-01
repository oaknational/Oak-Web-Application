import {
  OakTypography,
  OakFlex,
  OakHeading,
} from "@oaknational/oak-components";

import {
  shortAnswerTitleFormatter,
  removeMarkdown,
} from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import QuizImage from "@/components/TeacherComponents/QuizImage";
import {
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizQuestionsQuestionStem = ({
  questionStem,
  index,
  showIndex = true,
}: {
  questionStem: (StemImageObject | StemTextObject)[];
  index: number;
  showIndex?: boolean;
}) => {
  const displayNumber = `Q${index + 1}.`;
  return (
    <OakFlex $flexDirection={"column"} $gap="all-spacing-1">
      <OakFlex key="stem-header">
        {showIndex && (
          <OakHeading
            $font={["body-2-bold", "body-1-bold"]}
            $mr="space-between-xs"
            tag="h4"
          >
            {displayNumber}
          </OakHeading>
        )}
        {questionStem[0]?.type === "text" && (
          <OakHeading
            key={`q-${displayNumber}-stem-element-0`}
            $font={["body-2-bold", "body-1-bold"]}
            tag="h4"
          >
            {shortAnswerTitleFormatter(removeMarkdown(questionStem[0].text))}
          </OakHeading>
        )}
      </OakFlex>

      {questionStem.map((stemItem, i) => {
        if (stemItem.type === "text" && i > 0) {
          return (
            <OakTypography
              key={`q-${displayNumber}-stem-element-${i}`}
              $font={["body-2-bold", "body-1-bold"]}
            >
              {shortAnswerTitleFormatter(removeMarkdown(stemItem.text))}
            </OakTypography>
          );
        } else if (stemItem.type === "image") {
          return (
            <OakFlex
              $pv="inner-padding-xl"
              key={`q-${displayNumber}-stem-element-${i}`}
            >
              <QuizImage src={stemItem.imageObject} alt="An image in a quiz" />
            </OakFlex>
          );
        }
      })}
    </OakFlex>
  );
};
