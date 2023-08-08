import React from "react";

import SpeechBubble from "../SpeechBubble/SpeechBubble";
import Flex from "../Flex";

import { MarginValues } from "@/styles/utils/spacing";

export type TeacherTip = {
  teacherTip: string | null;
};

type LessonTeacherTips = {
  teacherTips: TeacherTip[];
  marginBottom?: MarginValues;
};

const TeacherTips = ({ teacherTips, marginBottom }: LessonTeacherTips) => {
  const [teacherTip] = teacherTips;
  return (
    <Flex $mb={marginBottom}>
      <SpeechBubble text={teacherTip?.teacherTip} label={"Teacher tip"} />
    </Flex>
  );
};

export default TeacherTips;
