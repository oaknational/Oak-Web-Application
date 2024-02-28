import React from "react";
import { OakFlex } from "@oaknational/oak-components";

import LessonOverviewSpeechBubble from "@/components/TeacherComponents/LessonOverviewSpeechBubble";

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
    <OakFlex>
      <LessonOverviewSpeechBubble
        text={teacherTip?.teacherTip}
        label={"Teacher tip"}
      />
    </OakFlex>
  );
};

export default LessonOverviewTeacherTips;
