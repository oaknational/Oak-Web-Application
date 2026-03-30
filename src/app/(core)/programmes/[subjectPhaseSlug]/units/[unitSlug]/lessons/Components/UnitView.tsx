"use client";
import { OakGrid, OakGridArea, OakMaxWidth } from "@oaknational/oak-components";

import { LessonList } from "./LessonList";

type UnitViewLesson = {
  lessonSlug: string;
  lessonTitle: string;
  pupilLessonOutcome?: string | null;
  orderInUnit?: number | null;
  isUnpublished: boolean;
};

type UnitViewProps = {
  programmeSlug: string;
  unitSlug: string;
  unitTitle: string;
  subjectTitle?: string | null;
  subjectSlug: string;
  keyStageSlug?: string;
  keyStageTitle?: string | null;
  lessons: UnitViewLesson[];
  yearTitle: string;
};

export const UnitView = ({
  programmeSlug,
  unitSlug,
  unitTitle,
  subjectTitle,
  subjectSlug,
  keyStageSlug,
  keyStageTitle,
  lessons,
  yearTitle,
}: UnitViewProps) => {
  return (
    <OakMaxWidth
      data-testid="programme-tabs"
      $ph={["spacing-20", "spacing-20", "spacing-0"]}
      $mb={["spacing-0", "spacing-48", "spacing-48"]}
      $mt={["spacing-48", "spacing-56"]}
    >
      <OakGrid $cg="spacing-16">
        <OakGridArea $colSpan={[12, 5]} />
        <OakGridArea $colSpan={[12, 7]} $gap="spacing-56">
          <LessonList
            programmeSlug={programmeSlug}
            unitSlug={unitSlug}
            unitTitle={unitTitle}
            subjectTitle={subjectTitle}
            subjectSlug={subjectSlug}
            keyStageSlug={keyStageSlug}
            keyStageTitle={keyStageTitle}
            lessons={lessons}
            unitIndexLabel={yearTitle}
            lessonCount={lessons.length}
          />
        </OakGridArea>
      </OakGrid>
    </OakMaxWidth>
  );
};
