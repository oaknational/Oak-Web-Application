"use client";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
} from "@oaknational/oak-components";

import { LessonList } from "./LessonList";
import { ProgrammeToggles } from "./ProgrammeToggles";

import type { TeachersUnitOverviewData } from "@/node-lib/curriculum-api-2023/queries/teachersUnitOverview/teachersUnitOverview.schema";
import SkipLink from "@/components/CurriculumComponents/OakComponentsKitchen/SkipLink";

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
  | "unitIndex"
  | "unitCount"
  | "tierOptionToggles"
  | "subjectOptionToggles"
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
  unitIndex,
  unitCount,
  tierOptionToggles,
  subjectOptionToggles,
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
        $position="relative"
      >
        <OakBox
          $position="absolute"
          $zIndex="in-front"
          $top="spacing-0"
          $left="spacing-0"
        >
          <SkipLink href="#lessons">Skip to lessons</SkipLink>
        </OakBox>
        <OakGridArea $colSpan={[12, 5]}>
          <OakFlex $flexDirection="column" $gap="spacing-32" $pb="spacing-56">
            <ProgrammeToggles
              heading="Learning tier (KS4)"
              headingId="tier-toggle-heading"
              unitSlug={unitSlug}
              programmeToggles={tierOptionToggles}
            />
            <ProgrammeToggles
              heading="Exam subject (KS4)"
              headingId="subject-toggle-heading"
              unitSlug={unitSlug}
              programmeToggles={subjectOptionToggles}
            />
          </OakFlex>
        </OakGridArea>
        <OakGridArea $colSpan={[12, 7]} $gap="spacing-56" id="lessons">
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
            unitIndex={unitIndex}
            unitCount={unitCount}
            lessonCount={lessons.length}
          />
        </OakGridArea>
      </OakGrid>
    </OakBox>
  );
};
