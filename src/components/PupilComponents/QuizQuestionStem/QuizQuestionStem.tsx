import { OakFlex, OakImage, OakSpan } from "@oak-academy/oak-components";

import {
  removeMarkdown,
  shortAnswerTitleFormatter,
} from "@/components/TeacherComponents/LessonOverviewQuizContainer/quizUtils";
import {
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";

export const QuizQuestionStem = ({
  questionStem,
  index,
}: {
  questionStem: (StemImageObject | StemTextObject)[];
  index: number;
  showIndex?: boolean;
}) => {
  const displayNumber = `Q${index + 1}.`;

  return (
    <OakFlex $flexDirection={"column"} $gap={"space-between-s"}>
      <OakFlex key="stem-header">
        {questionStem[0]?.type === "text" && (
          <OakSpan
            key={`q-${displayNumber}-stem-element-0`}
            $font={"heading-5"}
          >
            {shortAnswerTitleFormatter(removeMarkdown(questionStem[0].text))}
          </OakSpan>
        )}
      </OakFlex>

      {questionStem.map((stemItem, i) => {
        if (stemItem.type === "text" && i > 0) {
          return (
            <OakSpan
              key={`q-${displayNumber}-stem-element-${i}`}
              $font={["body-2-bold", "body-1-bold"]}
            >
              {shortAnswerTitleFormatter(removeMarkdown(stemItem.text))}
            </OakSpan>
          );
        } else if (stemItem.type === "image") {
          return (
            <OakFlex
              $pv={"inner-padding-xl"}
              key={`q-${displayNumber}-stem-element-${i}`}
            >
              <OakImage
                src={stemItem.image_object.secure_url}
                height={stemItem.image_object.height}
                width={stemItem.image_object.width}
                alt={""}
                $minWidth={"all-spacing-19"}
              />
            </OakFlex>
          );
        }
      })}
    </OakFlex>
  );
};
