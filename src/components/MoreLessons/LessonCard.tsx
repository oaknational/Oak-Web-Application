import React, { FC } from "react";
import styled from "styled-components";

import Card from "../Card";
import { Text, Heading } from "../Typography/Typography";

export type LessonCardProps = {
  lessonTitle: string;
  keyStage: "KS1" | "KS2" | "KS3" | "KS4";
  subject: string;
  topic: string;
  index: number;
};

const StyledLessonCard = styled(Card)`
  display: inline-block;
  width: calc((100% / 4 - 10px));
  background-color: lightgrey;
  border-radius: 10px;
  margin-left: 5px;
  margin-right: 5px;
`;

const LessonCard: FC<LessonCardProps> = ({
  lessonTitle,
  keyStage,
  subject,
  topic,
  index,
}) => {
  return (
    <StyledLessonCard>
      <Heading tag={"h3"} size={6}>
        {lessonTitle}
      </Heading>
      <Text>{`${keyStage}, ${subject}, ${topic}`}</Text>
      <Text>{`Lesson ${index}`}</Text>
    </StyledLessonCard>
  );
};

export default LessonCard;
