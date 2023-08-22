import { shortAnswerTitleFormatter, removeMarkdown } from "../../quizUtils";

import QuizImage from "./QuizImage";

import Flex from "@/components/Flex";
import Typography from "@/components/Typography";
import {
  StemImageObject,
  StemTextObject,
} from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export const QuestionStem = ({
  questionStem,
  index,
}: {
  questionStem: (StemImageObject | StemTextObject)[];
  index: number;
}) => {
  const displayNumber = `Q${index + 1}.`;
  return (
    <Flex $flexDirection={"column"} $gap={4}>
      <Flex>
        {displayNumber && (
          <Typography $font={["body-2-bold", "body-1-bold"]} $mr={12}>
            {displayNumber}
          </Typography>
        )}
        {questionStem[0]?.type === "text" && (
          <Typography
            key={`q-${displayNumber}-stem-element-0`}
            $font={["body-2-bold", "body-1-bold"]}
          >
            {shortAnswerTitleFormatter(removeMarkdown(questionStem[0].text))}
          </Typography>
        )}
      </Flex>

      {questionStem.map((stemItem, i) => {
        if (stemItem.type === "text" && i > 0) {
          return (
            <Typography
              key={`q-${displayNumber}-stem-element-${i}`}
              $font={["body-2-bold", "body-1-bold"]}
            >
              {shortAnswerTitleFormatter(removeMarkdown(stemItem.text))}
            </Typography>
          );
        } else if (stemItem.type === "image") {
          return (
            <Flex $pv={24}>
              <QuizImage
                key={`q-${displayNumber}-stem-element-${i}`}
                src={stemItem.image_object}
                alt="An image supporting the question"
              />
            </Flex>
          );
        } else {
          return <></>;
        }
      })}
    </Flex>
  );
};
