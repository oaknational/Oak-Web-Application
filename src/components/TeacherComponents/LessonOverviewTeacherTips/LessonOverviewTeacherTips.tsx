import React from "react";

import SpeechBubble from "../../SpeechBubble/SpeechBubble";

import Flex from "@/components/SharedComponents/Flex";

export type LessonOverviewTeacherTipProps = {
  teacherTip: string | null;
};

type LessonOverviewTeacherTipsProps = {
  teacherTips: LessonOverviewTeacherTipProps[];
};

const LessonOverviewTeacherTips = ({
  teacherTips,
}: LessonOverviewTeacherTipsProps) => {
  const [teacherTip] = teacherTips;
  return (
    <Flex>
      <SpeechBubble text={teacherTip?.teacherTip} label={"Teacher tip"} />
    </Flex>
  );
};

export default LessonOverviewTeacherTips;
