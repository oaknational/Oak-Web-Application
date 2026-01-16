import {
  OakTypography,
  OakFlex,
  OakHeading,
  OakSpan,
} from "@oaknational/oak-components";

import QuizImage from "@/components/TeacherComponents/QuizImage";
import { StemObject } from "@/node-lib/curriculum-api-2023/shared.schema";
import { Stem } from "@/components/SharedComponents/Stem";
import { isText } from "@/components/PupilComponents/QuizUtils/stemUtils";

export const QuizQuestionsQuestionStem = ({
  questionStem,
  index,
  showIndex = true,
}: {
  questionStem: StemObject[];
  index: number;
  showIndex?: boolean;
}) => {
  const displayNumber = `Q${index + 1}.`;
  const questionText = isText(questionStem[0]) && questionStem[0].text;
  return (
    <OakFlex $flexDirection={"column"} $gap="spacing-4">
      <OakHeading
        key={`q-${displayNumber}-stem-element-0`}
        $font={["body-2-bold", "body-1-bold"]}
        tag="h4"
      >
        <OakFlex key="stem-header">
          {(showIndex || questionText) && (
            <>
              {showIndex && <OakSpan $mr="spacing-12">{displayNumber}</OakSpan>}
              {isText(questionStem[0]) && questionText && (
                <Stem stem={questionStem[0]} />
              )}
            </>
          )}
        </OakFlex>
      </OakHeading>
      {questionStem.map((stemItem, i) => {
        if (stemItem.type === "text" && i > 0) {
          return (
            <OakTypography
              key={`q-${displayNumber}-stem-element-${i}`}
              $font={["body-2-bold", "body-1-bold"]}
            >
              <Stem stem={stemItem} />
            </OakTypography>
          );
        } else if (stemItem.type === "image") {
          return (
            <OakFlex
              $pv="spacing-24"
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
