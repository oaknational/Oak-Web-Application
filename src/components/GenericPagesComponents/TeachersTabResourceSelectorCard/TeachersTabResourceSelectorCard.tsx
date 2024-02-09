import { FC } from "react";
import { OakTypography, OakFlex } from "@oaknational/oak-components";

import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import Icon, { IconName } from "@/components/SharedComponents/Icon";
import Card from "@/components/SharedComponents/Card";
import { PositionProps } from "@/styles/utils/position";
import { DisplayProps } from "@/styles/utils/display";

type TeachersTabResourceSelectorCardProps = {
  icon: IconName;
  title: string;
  angle: number;
} & Omit<PositionProps, "$gap"> &
  DisplayProps;
const TeachersTabResourceSelectorCard: FC<
  TeachersTabResourceSelectorCardProps
> = (props) => {
  const { icon, title, angle, ...positionAndDisplayProps } = props;
  return (
    <Card
      $width={195}
      $height={66}
      $pa={0}
      $transform={`rotate(${angle}deg)`}
      $position={"absolute"}
      $background={"white"}
      {...positionAndDisplayProps}
    >
      <OakFlex $gap="all-spacing-4">
        <OakFlex
          $height={"100%"}
          $width={"fit-content"}
          $background={"oakGreen"}
          $pa="inner-padding-xs"
        >
          {" "}
          <Icon
            $color={"white"}
            name={icon}
            $objectPosition={"center"}
            size={50}
            $pa={3}
          />
        </OakFlex>
        <OakFlex $height={"100%"} $alignItems={"center"}>
          <OakTypography $font={"heading-light-7"} $color={"black"}>
            {title}
          </OakTypography>
        </OakFlex>
      </OakFlex>

      <BoxBorders $color={"black"} gapPosition={"rightTop"} />
    </Card>
  );
};

export default TeachersTabResourceSelectorCard;
