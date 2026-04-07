"use client";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakTypography,
} from "@oaknational/oak-components";

import { LessonList } from "./LessonList";

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
  | "whyThisWhyNow"
  | "priorKnowledgeRequirements"
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
  whyThisWhyNow,
  priorKnowledgeRequirements,
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
        <OakGridArea
          $colSpan={[12, 4]}
          $gap="spacing-56"
          $flexDirection={"column"}
        >
          <OakFlex $flexDirection={"column"} $gap={"spacing-20"}>
            <OakTypography $font={"heading-7"}>Why this why now</OakTypography>
            <OakTypography>{whyThisWhyNow}</OakTypography>
          </OakFlex>
          <OakFlex $flexDirection={"column"} $gap={"spacing-20"}>
            <OakTypography $font={"heading-7"}>
              Prior knowledge requirements
            </OakTypography>
            <OakTypography>{priorKnowledgeRequirements}</OakTypography>
          </OakFlex>
        </OakGridArea>
        <OakGridArea
          $colSpan={[12, 7]}
          $colStart={[1, 6]}
          $gap="spacing-56"
          id="lessons"
        >
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
