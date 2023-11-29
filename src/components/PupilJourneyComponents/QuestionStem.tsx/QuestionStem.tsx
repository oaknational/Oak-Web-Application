import { OakFlex, OakTypography } from "@oak-academy/oak-components";

import QuizImage from "@/components/QuizContainerNew/QuestionsListNew/QuestionListItemNew/QuizImage";
import {
  removeMarkdown,
  shortAnswerTitleFormatter,
} from "@/components/QuizContainerNew/quizUtils";
import {
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuestionStem = ({
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
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakFlex key="stem-header">
        {showIndex && (
          <OakTypography
            $font={["body-2-bold", "body-1-bold"]}
            $mr={"space-between-s"}
          >
            {displayNumber}
          </OakTypography>
        )}
        {questionStem[0]?.type === "text" && (
          <OakTypography
            key={`q-${displayNumber}-stem-element-0`}
            $font={["body-2-bold", "body-1-bold"]}
          >
            {shortAnswerTitleFormatter(removeMarkdown(questionStem[0].text))}
          </OakTypography>
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
              $pv={"inner-padding-xl"}
              key={`q-${displayNumber}-stem-element-${i}`}
            >
              <QuizImage src={stemItem.image_object} />
            </OakFlex>
          );
        }
      })}
    </OakFlex>
  );
};
