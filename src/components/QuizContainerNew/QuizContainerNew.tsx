import { FC } from "react";

import QuestionsListNew from "./QuestionsListNew";

import { LessonOverviewData } from "@/node-lib/curriculum-api";
import Flex from "@/components/Flex";
import BoxBorders from "@/components/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";

export type QuizProps = {
  questions: LessonOverviewData["exitQuiz"];
};

const QuizContainerNew: FC<QuizProps> = (props) => {
  return (
    <Flex
      $flexDirection={"column"}
      $justifyContent={"center"}
      $width={"100%"}
      $position={"relative"}
    >
      <QuestionsListNew {...props} />
      <BoxBorders gapPosition="rightTop" />
    </Flex>
  );
};

export default QuizContainerNew;
