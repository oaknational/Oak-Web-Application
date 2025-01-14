import React, { FC } from "react";
import { OakBox, OakGrid, OakGridArea } from "@oaknational/oak-components";

import LessonRequirementsHeading from "@/components/TeacherComponents/LessonRequirementsHeading";
import CopyrightNotice from "@/components/TeacherComponents/CopyrightNotice";
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
  updatedAt: string;
};

const LessonOverviewHelper: FC<LessonOverviewHelperProps> = ({
  equipment,
  contentGuidance,
  supervisionLevel,
  isLegacyLicense,
  updatedAt,
}) => {
  return (
    <OakBox $background={"aqua50"} $position={"relative"}>
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
          <OakBox $pt="inner-padding-xs">
            <CopyrightNotice
              $font={"body-2"}
              showPostAlbCopyright={!isLegacyLicense}
              openLinksExternally={false}
              copyrightYear={updatedAt}
            />
          </OakBox>
        </OakGridArea>
      </OakGrid>
      <BrushBorders color="aqua50" />
    </OakBox>
  );
};

export default LessonOverviewHelper;
