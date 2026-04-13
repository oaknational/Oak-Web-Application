import React from "react";
import { OakLessonLayout } from "@oaknational/oak-components";

import {
  PupilLessonQuizBottomNav,
  PupilLessonQuizBottomNavProps,
} from "./PupilLessonQuizBottomNav";
import {
  PupilLessonQuizTopNav,
  PupilLessonQuizTopNavProps,
} from "./PupilLessonQuizTopNav";
import { QuizSection } from "./quizSection";

export type PupilLessonQuizViewProps = {
  lessonSectionName: QuizSection;
  phase?: "primary" | "secondary";
  celebrate?: boolean;
  topNav: PupilLessonQuizTopNavProps;
  bottomNav: PupilLessonQuizBottomNavProps;
  questionSlot: React.ReactNode;
};

export const PupilLessonQuizView = ({
  lessonSectionName,
  phase,
  celebrate = false,
  topNav,
  bottomNav,
  questionSlot,
}: PupilLessonQuizViewProps) => {
  return (
    <OakLessonLayout
      lessonSectionName={lessonSectionName}
      phase={phase}
      celebrate={celebrate}
      topNavSlot={<PupilLessonQuizTopNav {...topNav} />}
      bottomNavSlot={<PupilLessonQuizBottomNav {...bottomNav} />}
    >
      {questionSlot}
    </OakLessonLayout>
  );
};
