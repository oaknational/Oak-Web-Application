import React from "react";
import {
  OakLessonTopNav,
  OakQuizCounter,
  OakSpan,
} from "@oaknational/oak-components";

import { QuizSection } from "./quizSection";

export type PupilLessonQuizTopNavProps = {
  section: QuizSection;
  backLinkSlot?: React.ReactNode;
  isExplanatoryText?: boolean;
  currentQuestion?: number;
  totalQuestions?: number;
  heading?: string;
};

export const PupilLessonQuizTopNav = ({
  section,
  backLinkSlot,
  isExplanatoryText = false,
  currentQuestion = 1,
  totalQuestions = 1,
  heading,
}: PupilLessonQuizTopNavProps) => {
  const navHeading =
    heading ?? (section === "starter-quiz" ? "Starter Quiz" : "Exit Quiz");

  return (
    <OakLessonTopNav
      backLinkSlot={backLinkSlot}
      heading={navHeading}
      lessonSectionName={section}
      counterSlot={
        !isExplanatoryText && (
          <OakQuizCounter counter={currentQuestion} total={totalQuestions} />
        )
      }
      mobileSummary={
        !isExplanatoryText && (
          <OakSpan $color="text-primary" $font="body-3">
            Question {currentQuestion} of {totalQuestions}
          </OakSpan>
        )
      }
    />
  );
};
