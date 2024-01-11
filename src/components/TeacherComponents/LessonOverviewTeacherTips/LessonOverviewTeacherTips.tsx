import React from "react";

import LessonOverviewSpeechBubble from "@/components/TeacherComponents/LessonOverviewSpeechBubble";
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
      <LessonOverviewSpeechBubble
        text={teacherTip?.teacherTip}
        label={"Teacher tip"}
      />
    </Flex>
  );
};

export default LessonOverviewTeacherTips;
