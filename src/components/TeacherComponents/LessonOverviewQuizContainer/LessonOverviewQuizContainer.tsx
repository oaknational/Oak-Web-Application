import { FC } from "react";
import { OakSpan, OakFlex, OakBox } from "@oaknational/oak-components";

import QuizQuestionsList from "@/components/TeacherComponents/QuizQuestionsList";
import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";

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
        $ba={"border-solid-m"}
      >
        <QuizQuestionsList {...props} />
      </OakFlex>
      {props.imageAttribution.length > 0 && (
        <OakBox $mt="space-between-m">
          {props.imageAttribution.map(({ attribution, questionNumber }) => (
            <>
              <OakSpan $font={"body-3-bold"}>{`${questionNumber} `}</OakSpan>
              <OakSpan $font={"body-3"}>{`${attribution} `}</OakSpan>
            </>
          ))}
        </OakBox>
      )}
    </>
  ) : null;
};

export default LessonOverviewQuizContainer;
