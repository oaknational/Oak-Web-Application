import { FC } from "react";

import { TeachersLessonOverviewData } from "../../node-lib/curriculum-api";
import Flex from "../Flex";

import QuestionsList from "./QuestionsList";

export type QuizProps = { questions: TeachersLessonOverviewData["exitQuiz"] };

const QuizContainer: FC<QuizProps> = (props) => {
  return (
    <Flex $flexDirection={"column"}>
      <QuestionsList {...props} />
    </Flex>
  );
};

export default QuizContainer;
