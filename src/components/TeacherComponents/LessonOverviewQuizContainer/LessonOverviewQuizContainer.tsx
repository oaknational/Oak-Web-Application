import { FC } from "react";
import { OakSpan, OakFlex } from "@oaknational/oak-components";

import QuizQuestionsList from "@/components/TeacherComponents/QuizQuestionsList";
import Box from "@/components/SharedComponents/Box";
import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";

export type QuizProps = {
  questions: NonNullable<LessonOverviewQuizData>;
  imageAttribution: { attribution: string; questionNumber: string }[];
  isMathJaxLesson: boolean;
};

const LessonOverviewQuizContainer: FC<QuizProps> = (props) => {
  return props.questions && props.questions.length > 0 ? (
    <>
      <OakFlex
        $flexDirection={"column"}
        $justifyContent={"center"}
        $width={"100%"}
        $position={"relative"}
      >
        <QuizQuestionsList {...props} />
        <BoxBorders />
      </OakFlex>
      {props.imageAttribution.length > 0 && (
        <Box $mt={24}>
          {props.imageAttribution.map(({ attribution, questionNumber }) => (
            <>
              <OakSpan $font={"body-3-bold"}>{`${questionNumber} `}</OakSpan>
              <OakSpan $font={"body-3"}>{`${attribution} `}</OakSpan>
            </>
          ))}
        </Box>
      )}
    </>
  ) : null;
};

export default LessonOverviewQuizContainer;
