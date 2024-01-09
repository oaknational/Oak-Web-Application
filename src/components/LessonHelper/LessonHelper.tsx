import React, { FC } from "react";

import LessonRequirementsHeading from "../LessonRequirements/LessonRequirementsHeading";
import CopyrightNotice from "../DownloadAndShareComponents/CopyrightNotice";

import Box from "@/components/SharedComponents/Box";
import Grid, { GridArea } from "@/components/SharedComponents/Grid";
import LessonRequirements, {
  Equipment,
  ContentGuidance,
} from "@/components/LessonRequirements/LessonRequirements";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";

type LessonHelperProps = {
  equipment: Equipment[] | null | undefined;
  contentGuidance: ContentGuidance[] | null | undefined;
  supervisionLevel: string | null | undefined;
  isLegacyLicense?: boolean;
};

const LessonHelper: FC<LessonHelperProps> = ({
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
            <LessonRequirements
              helperIcon={"equipment-required"}
              heading="Equipment"
              equipment={equipment}
            />
          </GridArea>
        )}
        {contentGuidance && (
          <GridArea $colStart={1} $colSpan={[12]}>
            <LessonRequirements
              helperIcon={"content-guidance"}
              heading="Content guidance"
              contentGuidance={contentGuidance}
            />
          </GridArea>
        )}
        {supervisionLevel && (
          <GridArea $colStart={1} $colSpan={[12]}>
            <LessonRequirements
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

export default LessonHelper;
