import { FC } from "react";

import { LessonOverviewData } from "../../node-lib/curriculum-api";
import Flex from "../Flex";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";

import QuestionsList from "./QuestionsList";

export type QuizProps = {
  questions: LessonOverviewData["exitQuiz"];
  info: LessonOverviewData["exitQuizInfo"];
};

const QuizContainer: FC<QuizProps> = (props) => {
  return (
    <Flex
      $flexDirection={"column"}
      $justifyContent={"center"}
      $width={"100%"}
      $position={"relative"}
    >
      <QuestionsList {...props} />
      <BoxBorders gapPosition="rightTop" />
    </Flex>
  );
};

export default QuizContainer;
