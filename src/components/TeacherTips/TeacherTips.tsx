import React from "react";

import SpeechBubble from "../SpeechBubble/SpeechBubble";
import Flex from "../Flex";

export type TeacherTip = {
  teacherTip: string | null;
};

type LessonTeacherTips = {
  teacherTips: TeacherTip[];
};

const TeacherTips = ({ teacherTips }: LessonTeacherTips) => {
  const [teacherTip] = teacherTips;
  return (
    <Flex>
      <SpeechBubble text={teacherTip?.teacherTip} label={"Teacher tip"} />
    </Flex>
  );
};

export default TeacherTips;
