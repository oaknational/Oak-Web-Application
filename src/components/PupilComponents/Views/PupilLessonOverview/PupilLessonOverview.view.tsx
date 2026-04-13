import React from "react";
import {
  OakBox,
  OakFlex,
  OakGrid,
  OakGridArea,
  OakLessonLayout,
} from "@oaknational/oak-components";

import {
  PupilLessonOverviewBottomNav,
  PupilLessonOverviewBottomNavProps,
} from "./PupilLessonOverviewBottomNav";
import {
  PupilLessonOverviewHeader,
  PupilLessonOverviewHeaderProps,
} from "./PupilLessonOverviewHeader";
import {
  PupilLessonOverviewSectionsNav,
  PupilLessonOverviewSectionsNavProps,
} from "./PupilLessonOverviewSectionsNav";

export type PupilLessonOverviewViewProps = {
  phase: "primary" | "secondary";
  topNavSlot?: React.ReactNode;
  backButtonSlot?: React.ReactNode;
  bannerSlot?: React.ReactNode;
  header: PupilLessonOverviewHeaderProps;
  outcomesSlot?: React.ReactNode;
  contentGuidanceSlot?: React.ReactNode;
  sectionsNav: PupilLessonOverviewSectionsNavProps;
  bottomNav: PupilLessonOverviewBottomNavProps;
};

export const PupilLessonOverviewView = ({
  phase,
  topNavSlot = null,
  backButtonSlot,
  bannerSlot,
  header,
  outcomesSlot,
  contentGuidanceSlot,
  sectionsNav,
  bottomNav,
}: PupilLessonOverviewViewProps) => {
  return (
    <OakLessonLayout
      lessonSectionName="overview"
      phase={phase}
      topNavSlot={topNavSlot}
      bottomNavSlot={<PupilLessonOverviewBottomNav {...bottomNav} />}
    >
      <OakGrid
        $maxWidth={["100%", "spacing-960", "100%"]}
        $mt="spacing-24"
        $mb={["spacing-0", "spacing-16"]}
        $mh="auto"
        $ph={["spacing-16", "spacing-24", "spacing-0"]}
      >
        <OakGridArea
          $colStart={[1, 1, 2]}
          $colSpan={[12, 12, 10]}
          $minHeight="spacing-32"
        >
          {backButtonSlot}
        </OakGridArea>

        {bannerSlot && (
          <OakGridArea
            $colStart={[1, 1, 2]}
            $colSpan={[12, 12, 10]}
            $pt="spacing-24"
            $display={["none", "block"]}
          >
            {bannerSlot}
          </OakGridArea>
        )}
      </OakGrid>

      <OakFlex
        $alignItems={["flex-start", "flex-start", "center"]}
        $pv="spacing-24"
        $ph={["spacing-0", "spacing-24", "spacing-0"]}
        $width="100%"
        $maxWidth={["100%", "spacing-960", "100%"]}
        $mh="auto"
      >
        <OakGrid $cg="spacing-16">
          <OakGridArea
            $colStart={[1, 1, 2]}
            $colSpan={[12, 12, 5]}
            $mb={["spacing-56", "spacing-56", "spacing-0"]}
          >
            <PupilLessonOverviewHeader {...header} />

            {outcomesSlot}

            {contentGuidanceSlot && (
              <OakBox
                $display={["none", "block"]}
                $mt="spacing-56"
                data-testid="content-guidance-info"
              >
                {contentGuidanceSlot}
              </OakBox>
            )}
          </OakGridArea>

          {bannerSlot && (
            <OakGridArea
              $display={["block", "none"]}
              $colStart={[1, 1, 7]}
              $colSpan={[12, 12, 5]}
              $ph={["spacing-16", "spacing-0"]}
              $pb="spacing-16"
            >
              {bannerSlot}
            </OakGridArea>
          )}

          <OakGridArea
            $colStart={[1, 1, 7]}
            $colSpan={[12, 12, 5]}
            $ph={["spacing-16", "spacing-0"]}
          >
            <PupilLessonOverviewSectionsNav {...sectionsNav} />
          </OakGridArea>
        </OakGrid>
      </OakFlex>
    </OakLessonLayout>
  );
};
