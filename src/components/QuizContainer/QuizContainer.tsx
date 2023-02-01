import { FC } from "react";

import { TeachersLessonOverviewData } from "../../node-lib/curriculum-api";
import Box from "../Box";
import Flex from "../Flex";
import Typography, { Heading } from "../Typography";

import QuestionsList from "./QuestionsList";

export type QuizProps = Exclude<TeachersLessonOverviewData["exitQuiz"], null>;

const QuizContainer: FC<QuizProps> = (props) => {
  const { title, maxPoints, questions } = props;
  return (
    <Flex $flexDirection={"column"}>
      <Box>
        {title && <Heading tag={"h3"}>{title}</Heading>}
        <Typography $mb={32} $font={["body-2", "body-1"]}>
          Max points: {maxPoints}
        </Typography>
      </Box>
      <QuestionsList listProps={questions} />
    </Flex>
  );
};

export default QuizContainer;
