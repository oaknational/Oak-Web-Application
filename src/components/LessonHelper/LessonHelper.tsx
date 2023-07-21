import React, { FC } from "react";

import Card from "../Card";
import { GridArea } from "../Grid";
import Icon, { IconName } from "../Icon";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import Typography, { Heading } from "../Typography";

type HelperProps = {
  helperIcon: IconName;
  helperTitle: string;
  contentGuidance?: ContentGuidance[] | null | undefined;
  equipment?:
    | {
        equipment: string;
      }[]
    | null
    | undefined;
  supervisionLevel?: string | null | undefined;
};

type ContentGuidance = {
  contentGuidanceLabel: string;
  contentGuidanceDescription: string;
  contentGuidanceArea: string;
};

const LessonHelper: FC<HelperProps> = ({
  helperIcon,
  helperTitle,
  supervisionLevel,
  contentGuidance,
  equipment,
}) => {
  if (!contentGuidance && !equipment && !supervisionLevel) {
    return null;
  }

  return (
    <GridArea $colSpan={[12, 12, 4]}>
      <Card
        $background={"teachersPastelYellow"}
        $flexDirection={"row"}
        $flexWrap={"wrap"}
        $alignItems={"center"}
        $pa={12}
      >
        <Heading $font={"heading-5"} tag={"h3"} $ma={12}>
          <Icon variant="minimal" name={helperIcon} /> {helperTitle}
        </Heading>
        {contentGuidance &&
          contentGuidance.map((guidance: ContentGuidance) => {
            return (
              <Typography
                $font={"body-2"}
                $ma={12}
                key={guidance.contentGuidanceLabel}
              >
                {guidance.contentGuidanceLabel}
              </Typography>
            );
          })}
        {supervisionLevel && (
          <Typography $font={"body-2"} $ma={12}>
            {supervisionLevel}
          </Typography>
        )}
        {equipment &&
          equipment.map(({ equipment }) => {
            return (
              <Typography $font={"body-2"} $ma={12} key={equipment}>
                {equipment}
              </Typography>
            );
          })}

        <BrushBorders color="teachersPastelYellow" />
      </Card>
    </GridArea>
  );
};

export default LessonHelper;
