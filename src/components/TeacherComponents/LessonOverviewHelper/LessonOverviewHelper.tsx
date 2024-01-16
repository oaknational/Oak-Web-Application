import React, { FC } from "react";

import LessonRequirementsHeading from "@/components/TeacherComponents/LessonRequirementsHeading";
import CopyrightNotice from "@/components/DownloadAndShareComponents/CopyrightNotice";
import Box from "@/components/SharedComponents/Box";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
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
};

const LessonOverviewHelper: FC<LessonOverviewHelperProps> = ({
  equipment,
  contentGuidance,
  supervisionLevel,
  isLegacyLicense,
}) => {
  return (
    <Box $background={"aqua50"} $position={"relative"} $width={320}>
      <Grid $rg={32} $pa={24}>
        {equipment && equipment?.length > 0 && (
          <GridArea $colStart={1} $colSpan={[12]}>
            <LessonOverviewRequirements
              helperIcon={"equipment-required"}
              heading="Equipment"
              equipment={equipment}
            />
          </GridArea>
        )}
        {contentGuidance && (
          <GridArea $colStart={1} $colSpan={[12]}>
            <LessonOverviewRequirements
              helperIcon={"content-guidance"}
              heading="Content guidance"
              contentGuidance={contentGuidance}
            />
          </GridArea>
        )}
        {supervisionLevel && (
          <GridArea $colStart={1} $colSpan={[12]}>
            <LessonOverviewRequirements
              helperIcon={"supervision-level"}
              heading="Supervision"
              supervisionLevel={supervisionLevel}
            />
          </GridArea>
        )}
        <GridArea $colStart={1} $colSpan={[12]}>
          <LessonRequirementsHeading
            helperIcon={"copyright"}
            heading="Licence"
          />
          <Box $pt={8}>
            <CopyrightNotice
              $font={"body-2"}
              showPostAlbCopyright={!isLegacyLicense}
              openLinksExternally={false}
            />
          </Box>
        </GridArea>
      </Grid>
      <BrushBorders color="aqua50" />
    </Box>
  );
};

export default LessonOverviewHelper;
