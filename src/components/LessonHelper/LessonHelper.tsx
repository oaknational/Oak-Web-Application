import React, { FC } from "react";

import Card from "../Card";
import { GridArea } from "../Grid";
import Icon, { IconName } from "../Icon";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import Typography, { Heading } from "../Typography";

type HelperProps = {
  helperIcon: IconName;
  helperTitle: string;
  helperDescription: string | null;
};

const LessonHelper: FC<HelperProps> = ({
  helperIcon,
  helperTitle,
  helperDescription,
}) => {
  if (!helperDescription) {
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
        <Typography $font={"body-2"} $ma={12}>
          {helperDescription}
        </Typography>
        <BrushBorders color="teachersPastelYellow" />
      </Card>
    </GridArea>
  );
};

export default LessonHelper;
