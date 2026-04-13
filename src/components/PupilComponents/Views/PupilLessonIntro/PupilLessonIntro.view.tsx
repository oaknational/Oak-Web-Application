import React from "react";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakLessonLayout,
} from "@oaknational/oak-components";

import { PupilLessonBottomNav, PupilLessonBottomNavProps } from "../shared";

export type PupilLessonIntroViewProps = {
  phase: "primary" | "secondary";
  topNavSlot?: React.ReactNode;
  heading?: string;
  readyToLearnSlot?: React.ReactNode;
  lessonInfoSlot?: React.ReactNode;
  licenceSlot?: React.ReactNode;
  bottomNav: PupilLessonBottomNavProps;
};

export const PupilLessonIntroView = ({
  phase,
  topNavSlot = null,
  heading = "What will you need for this lesson?",
  readyToLearnSlot,
  lessonInfoSlot,
  licenceSlot,
  bottomNav,
}: PupilLessonIntroViewProps) => {
  return (
    <OakLessonLayout
      lessonSectionName="intro"
      phase={phase}
      topNavSlot={topNavSlot}
      bottomNavSlot={<PupilLessonBottomNav {...bottomNav} />}
    >
      <OakGrid
        $cg="spacing-16"
        $maxWidth={["100%", "spacing-640", "100%"]}
        $mb={["spacing-0", "spacing-16"]}
        $mh="auto"
        $ph={["spacing-16", "spacing-24", "spacing-0"]}
        $minHeight="100%"
        $gridTemplateRows={[
          "min-content min-content 1fr",
          "min-content min-content 1fr",
          "min-content 1fr min-content",
        ]}
      >
        <OakGridArea
          $colStart={[1, 1, 2]}
          $colSpan={[12, 12, 10]}
          $mb={["spacing-24", "spacing-48", "spacing-56"]}
        >
          <OakHeading tag="h1" $font={["heading-5", "heading-4", "heading-3"]}>
            {heading}
          </OakHeading>
        </OakGridArea>

        <OakGridArea
          $colSpan={[12, 12, 5]}
          $colStart={[1, 1, 2]}
          $pb="spacing-24"
        >
          <OakFlex $maxWidth={["100%", "100%", "fit-content"]}>
            {readyToLearnSlot}
          </OakFlex>
        </OakGridArea>

        <OakGridArea $colSpan={[12, 12, 5]} $pb="spacing-24">
          <OakFlex $flexDirection="column" $gap="spacing-16">
            {lessonInfoSlot}
          </OakFlex>
        </OakGridArea>

        {licenceSlot && (
          <OakGridArea
            $colStart={[1, 1, 2]}
            $colSpan={[12, 12, 7]}
            $pt="spacing-24"
          >
            {licenceSlot}
          </OakGridArea>
        )}
      </OakGrid>
    </OakLessonLayout>
  );
};
