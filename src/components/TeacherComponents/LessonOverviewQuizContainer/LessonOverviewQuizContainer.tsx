import { FC } from "react";

import QuizQuestionsList from "@/components/TeacherComponents/QuizQuestionsList";
import { Span } from "@/components/SharedComponents/Typography";
import Box from "@/components/SharedComponents/Box";
import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";
import Flex from "@/components/SharedComponents/Flex";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";

export type QuizProps = {
  questions: NonNullable<LessonOverviewQuizData>;
  imageAttribution: { attribution: string; questionNumber: string }[];
};

const LessonOverviewQuizContainer: FC<QuizProps> = (props) => {
  return props.questions && props.questions.length > 0 ? (
    <>
      <Flex
        $flexDirection={"column"}
        $justifyContent={"center"}
        $width={"100%"}
        $position={"relative"}
      >
        <QuizQuestionsList {...props} />
        <BoxBorders />
      </Flex>
      {props.imageAttribution.length > 0 && (
        <Box $mt={24}>
          {props.imageAttribution.map(({ attribution, questionNumber }) => (
            <>
              <Span $font={"body-3-bold"}>{`${questionNumber} `}</Span>
              <Span $font={"body-3"}>{`${attribution} `}</Span>
            </>
          ))}
        </Box>
      )}
    </>
  ) : null;
};

export default LessonOverviewQuizContainer;
