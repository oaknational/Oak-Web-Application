import React, { FC } from "react";
import { OakGrid, OakGridArea } from "@oaknational/oak-components";

import LessonRequirementsHeading from "@/components/TeacherComponents/LessonRequirementsHeading";
import CopyrightNotice from "@/components/TeacherComponents/CopyrightNotice";
import Box from "@/components/SharedComponents/Box";
import LessonOverviewRequirements, {
  Equipment,
  ContentGuidance,
} from "@/components/TeacherComponents/LessonOverviewRequirements";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";

type LessonOverviewHelperProps = {
  equipment: Equipment[] | null | undefined;
  contentGuidance: ContentGuidance[] | null | undefined;
  supervisionLevel: string | null | undefined;
  isLegacyLicense?: boolean;
  updatedAt?: string;
};

const LessonOverviewHelper: FC<LessonOverviewHelperProps> = ({
  equipment,
  contentGuidance,
  supervisionLevel,
  isLegacyLicense,
  updatedAt,
}) => {
  return (
    <Box $background={"aqua50"} $position={"relative"} $width={320}>
      <OakGrid $rg={"all-spacing-7"} $pa={"inner-padding-xl"}>
        {equipment && equipment?.length > 0 && (
          <OakGridArea $colStart={1} $colSpan={[12]}>
            <LessonOverviewRequirements
              helperIcon={"equipment-required"}
              heading="Equipment"
              equipment={equipment}
            />
          </OakGridArea>
        )}
        {contentGuidance && (
          <OakGridArea $colStart={1} $colSpan={[12]}>
            <LessonOverviewRequirements
              helperIcon={"content-guidance"}
              heading="Content guidance"
              contentGuidance={contentGuidance}
            />
          </OakGridArea>
        )}
        {supervisionLevel && (
          <OakGridArea $colStart={1} $colSpan={[12]}>
            <LessonOverviewRequirements
              helperIcon={"supervision-level"}
              heading="Supervision"
              supervisionLevel={supervisionLevel}
            />
          </OakGridArea>
        )}
        <OakGridArea $colStart={1} $colSpan={[12]}>
          <LessonRequirementsHeading
            helperIcon={"copyright"}
            heading="Licence"
          />
          <Box $pt={8}>
            <CopyrightNotice
              $font={"body-2"}
              showPostAlbCopyright={!isLegacyLicense}
              openLinksExternally={false}
              copyrightYear={updatedAt}
            />
          </Box>
        </OakGridArea>
      </OakGrid>
      <BrushBorders color="aqua50" />
    </Box>
  );
};

export default LessonOverviewHelper;
