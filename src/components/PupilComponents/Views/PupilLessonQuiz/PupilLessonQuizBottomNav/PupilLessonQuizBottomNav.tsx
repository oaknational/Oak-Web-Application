import React from "react";
import { OakLessonBottomNav } from "@oaknational/oak-components";

export type PupilLessonQuizBottomNavProps = {
  hint?: React.ReactNode;
  onHintToggled?: ({ isOpen }: { isOpen: boolean }) => void;
  feedback?: "correct" | "incorrect" | "partially-correct" | null;
  answerFeedback?: React.ReactNode;
  actionSlot: React.ReactNode;
};

export const PupilLessonQuizBottomNav = ({
  hint,
  onHintToggled,
  feedback,
  answerFeedback,
  actionSlot,
}: PupilLessonQuizBottomNavProps) => {
  return (
    <OakLessonBottomNav
      hint={hint}
      hintToggled={onHintToggled}
      feedback={feedback}
      answerFeedback={answerFeedback}
    >
      {actionSlot}
    </OakLessonBottomNav>
  );
};
