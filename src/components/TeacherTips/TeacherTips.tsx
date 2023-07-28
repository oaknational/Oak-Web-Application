import React from "react";

import Flex from "../Flex";
import { Heading, P } from "../Typography";

export type TeacherTip = {
  teacherTip: string | null;
};

type LessonTeacherTips = { teacherTips: TeacherTip[] };

const TeacherTips = ({ teacherTips }: LessonTeacherTips) => {
  const [teacherTip] = teacherTips;
  return (
    <Flex>
      <Flex $flexDirection={"column"}>
        <P>{teacherTip?.teacherTip}</P>
        <Heading tag="h3" data-testid={"heading"}>
          Teacher tip
        </Heading>
      </Flex>
    </Flex>
  );
};

export default TeacherTips;
