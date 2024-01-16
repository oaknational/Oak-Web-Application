import { OakFlex } from "@oak-academy/oak-components";

import {
  QuestionsArray,
  QuizEngineProvider,
} from "@/components/PupilComponents/QuizEngineProvider";
import { QuizRenderer } from "@/components/PupilComponents/QuizRenderer";

type PupilViewsQuizProps = {
  questionsArray: QuestionsArray;
};

export const PupilViewsQuiz = ({ questionsArray }: PupilViewsQuizProps) => {
  return (
    <QuizEngineProvider questionsArray={questionsArray}>
      <OakFlex
        $width={"100vw"}
        $height={"100vh"}
        $background={"bg-decorative1–main"}
        $flexDirection={"column"}
        $alignItems={"center"}
        $pt="inner-padding-xl"
      >
        <QuizRenderer />
      </OakFlex>
    </QuizEngineProvider>
  );
};
