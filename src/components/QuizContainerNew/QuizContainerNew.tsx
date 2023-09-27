import { FC } from "react";

import QuestionsListNew from "./QuestionsListNew";

import { LessonOverviewQuizData } from "@/node-lib/curriculum-api-2023/shared.schema";
import Flex from "@/components/Flex";
import BoxBorders from "@/components/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";

export type QuizProps = {
  questions: NonNullable<LessonOverviewQuizData>;
};

const QuizContainerNew: FC<QuizProps> = (props) => {
  return props.questions && props.questions.length > 0 ? (
    <Flex
      $flexDirection={"column"}
      $justifyContent={"center"}
      $width={"100%"}
      $position={"relative"}
    >
      <QuestionsListNew {...props} />
      <BoxBorders />
    </Flex>
  ) : null;
};

export default QuizContainerNew;
