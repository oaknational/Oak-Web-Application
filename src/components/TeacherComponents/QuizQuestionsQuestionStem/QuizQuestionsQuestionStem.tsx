import { OakTypography } from "@oaknational/oak-components";

import {
  shortAnswerTitleFormatter,
  removeMarkdown,
} from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import QuizImage from "@/components/TeacherComponents/QuizImage";
import Flex from "@/components/SharedComponents/Flex";
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
    <Flex $flexDirection={"column"} $gap={4}>
      <Flex key="stem-header">
        {showIndex && (
          <OakTypography
            $font={["body-2-bold", "body-1-bold"]}
            $mr="space-between-xs"
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
      </Flex>

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
            <Flex $pv={24} key={`q-${displayNumber}-stem-element-${i}`}>
              <QuizImage src={stemItem.image_object} />
            </Flex>
          );
        }
      })}
    </Flex>
  );
};
