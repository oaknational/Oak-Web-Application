import { FC } from "react";

import { Span } from "../Typography";
import Box from "../Box";

import QuestionsListNew from "./QuestionsListNew";

import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";
import Flex from "@/components/Flex";
import BoxBorders from "@/components/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";

export type QuizProps = {
  questions: NonNullable<LessonOverviewQuizData>;
};

const QuizContainerNew: FC<QuizProps> = (props) => {
  const imageAttribution: { attribution: string; questionNumber: string } | [] =
    [];
  return props.questions && props.questions.length > 0 ? (
    <>
      <Flex
        $flexDirection={"column"}
        $justifyContent={"center"}
        $width={"100%"}
        $position={"relative"}
      >
        <QuestionsListNew {...props} />
        <BoxBorders />
      </Flex>
      {imageAttribution.length > 0 && (
        <Box $mt={24}>
          {imageAttribution.map(({ attribution, questionNumber }) => (
            <>
              <Span $font={"body-3-bold"}>{`Q${questionNumber} `}</Span>
              <Span $font={"body-3"}>{`${attribution} `}</Span>
            </>
          ))}
        </Box>
      )}
    </>
  ) : null;
};

export default QuizContainerNew;
