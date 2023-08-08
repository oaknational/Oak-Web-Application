import React, { FC } from "react";

import Box from "@/components/Box";
import Grid, { GridArea } from "@/components/Grid";
import LessonRequirements, {
  Equipment,
  ContentGuidance,
} from "@/components/LessonRequirements/LessonRequirements";
import BrushBorders from "@/components/SpriteSheet/BrushSvgs/BrushBorders/BrushBorders";

type LessonHelperProps = {
  equipment: Equipment[] | null | undefined;
  contentGuidance: ContentGuidance[] | null | undefined;
  supervisionLevel: string | null | undefined;
};

const LessonHelper: FC<LessonHelperProps> = ({
  equipment,
  contentGuidance,
  supervisionLevel,
}) => {
  return (
    <Box $background={"aqua50"} $position={"relative"}>
      <Grid $minWidth={320} $rg={32} $pa={24}>
        {equipment && (
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
      </Grid>
      <BrushBorders color="aqua50" />
    </Box>
  );
};

export default LessonHelper;
