import React, { useEffect, useRef } from "react";
import {
  OakFlex,
  OakLessonReviewIntroVideo,
  OakLessonReviewQuiz,
} from "@oaknational/oak-components";

const getResultsButtonAriaLabel = (section: "starter-quiz" | "exit-quiz") =>
  section === "starter-quiz" ? "Starter quiz results" : "Exit quiz results";

type LessonReviewQuizWithAriaLabelProps = React.ComponentProps<
  typeof OakLessonReviewQuiz
> & {
  resultsButtonAriaLabel: string;
};

/**
 * `OakLessonReviewQuiz` renders a generic "Results" button.
 * For screen readers, we need that button's accessible name to include the section.
 * We do this here (without changing the UI label) by setting `aria-label` on the
 * expand/collapse button once the component has rendered.
 */
const LessonReviewQuizWithAriaLabel = (
  props: LessonReviewQuizWithAriaLabelProps,
) => {
  const { resultsButtonAriaLabel, ...quizProps } = props;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = containerRef.current?.querySelector<HTMLButtonElement>(
      "button[aria-expanded]",
    );
    if (button) {
      button.setAttribute("aria-label", resultsButtonAriaLabel);
    }
  }, [resultsButtonAriaLabel]);

  return (
    <div ref={containerRef}>
      <OakLessonReviewQuiz {...quizProps} />
    </div>
  );
};

export type PupilLessonReviewSectionItem =
  | {
      section: "intro" | "video";
      completed: boolean;
    }
  | {
      section: "starter-quiz" | "exit-quiz";
      completed: boolean;
      grade: number;
      numQuestions: number;
      resultsSlot: React.ReactNode;
    };

export type PupilLessonReviewSectionsProps = {
  items: PupilLessonReviewSectionItem[];
};

const isQuizSectionItem = (
  item: PupilLessonReviewSectionItem,
): item is Extract<
  PupilLessonReviewSectionItem,
  { section: "starter-quiz" | "exit-quiz" }
> => {
  return item.section === "starter-quiz" || item.section === "exit-quiz";
};

export const PupilLessonReviewSections = ({
  items,
}: PupilLessonReviewSectionsProps) => {
  return (
    <OakFlex
      $flexDirection="column"
      $alignItems="stretch"
      $gap="spacing-16"
      $mb="spacing-56"
    >
      {items.map((item) => {
        if (item.section === "intro" || item.section === "video") {
          return (
            <OakLessonReviewIntroVideo
              key={item.section}
              lessonSectionName={item.section}
              completed={item.completed}
            />
          );
        }

        if (!isQuizSectionItem(item)) {
          return null;
        }

        return (
          <LessonReviewQuizWithAriaLabel
            key={item.section}
            lessonSectionName={item.section}
            completed={item.completed}
            grade={item.grade}
            numQuestions={item.numQuestions}
            resultsSlot={item.resultsSlot}
            resultsButtonAriaLabel={getResultsButtonAriaLabel(item.section)}
          />
        );
      })}
    </OakFlex>
  );
};
