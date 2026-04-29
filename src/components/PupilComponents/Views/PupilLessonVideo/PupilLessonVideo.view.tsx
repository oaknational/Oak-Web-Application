import React from "react";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHandDrawnHR,
  OakLessonLayout,
} from "@oaknational/oak-components";

import { PupilLessonBottomNav, PupilLessonBottomNavProps } from "../shared";

import {
  PupilLessonVideoTopNav,
  PupilLessonVideoTopNavProps,
} from "./PupilLessonVideoTopNav";

export type PupilLessonVideoViewProps = {
  phase?: "primary" | "secondary";
  topNav: PupilLessonVideoTopNavProps;
  bottomNav: PupilLessonBottomNavProps;
  videoSlot: React.ReactNode;
  transcriptSlot?: React.ReactNode;
  additionalFilesSlot?: React.ReactNode;
};

export const PupilLessonVideoView = ({
  phase,
  topNav,
  bottomNav,
  videoSlot,
  transcriptSlot,
  additionalFilesSlot,
}: PupilLessonVideoViewProps) => {
  return (
    <OakLessonLayout
      lessonSectionName="video"
      phase={phase}
      topNavSlot={<PupilLessonVideoTopNav {...topNav} />}
      bottomNavSlot={<PupilLessonBottomNav {...bottomNav} />}
    >
      <OakGrid
        $maxWidth={["100%", "spacing-960", "100%"]}
        $mh="auto"
        $ph={["spacing-16", "spacing-24", "spacing-0"]}
      >
        <OakGridArea
          $colStart={[1, 1, 3]}
          $colSpan={[12, 12, 8]}
          $mb="spacing-32"
        >
          {videoSlot}
        </OakGridArea>

        <OakGridArea $colStart={[1, 1, 3]} $colSpan={[12, 12, 8]}>
          {transcriptSlot}
          <OakHandDrawnHR
            $height="spacing-4"
            hrColor="bg-interactive-element2"
            $width="100%"
          />
          <OakFlex $flexDirection="column" $gap="spacing-16">
            {additionalFilesSlot}
          </OakFlex>
        </OakGridArea>
      </OakGrid>
    </OakLessonLayout>
  );
};
