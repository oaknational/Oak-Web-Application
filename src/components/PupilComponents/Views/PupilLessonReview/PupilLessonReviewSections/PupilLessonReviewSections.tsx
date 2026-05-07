import React from "react";
import {
  OakFlex,
  OakLessonReviewIntroVideo,
  OakLessonReviewQuiz,
} from "@oaknational/oak-components";

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
          <OakLessonReviewQuiz
            key={item.section}
            lessonSectionName={item.section}
            completed={item.completed}
            grade={item.grade}
            numQuestions={item.numQuestions}
            resultsSlot={item.resultsSlot}
          />
        );
      })}
    </OakFlex>
  );
};
