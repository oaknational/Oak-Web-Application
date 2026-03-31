"use client";
import { OakBox, OakGrid, OakGridArea } from "@oaknational/oak-components";

import { LessonList } from "./LessonList";

import type { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";

export type UnitViewProps = Pick<
  TeachersUnitOverviewData,
  | "programmeSlug"
  | "unitSlug"
  | "unitTitle"
  | "unitDescription"
  | "subjectTitle"
  | "subjectSlug"
  | "keyStageSlug"
  | "keyStageTitle"
  | "lessons"
  | "unitOrder"
  | "unitCount"
>;

export const UnitView = ({
  programmeSlug,
  unitSlug,
  unitTitle,
  unitDescription,
  subjectTitle,
  subjectSlug,
  keyStageSlug,
  keyStageTitle,
  lessons,
  unitOrder,
  unitCount,
}: UnitViewProps) => {
  return (
    <OakBox $ph="spacing-40">
      <OakGrid
        $cg="spacing-16"
        $mb={["spacing-0", "spacing-48", "spacing-48"]}
        $mh="auto"
        $mt={["spacing-48", "spacing-56"]}
        $width={"100%"}
        $maxWidth={"spacing-1280"}
      >
        <OakGridArea $colSpan={[12, 5]} />
        <OakGridArea $colSpan={[12, 7]} $gap="spacing-56">
          <LessonList
            programmeSlug={programmeSlug}
            unitSlug={unitSlug}
            unitTitle={unitTitle}
            unitDescription={unitDescription}
            subjectTitle={subjectTitle}
            subjectSlug={subjectSlug}
            keyStageSlug={keyStageSlug}
            keyStageTitle={keyStageTitle}
            lessons={lessons}
            unitOrder={unitOrder}
            unitCount={unitCount}
            lessonCount={lessons.length}
          />
        </OakGridArea>
      </OakGrid>
    </OakBox>
  );
};
