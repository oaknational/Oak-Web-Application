import { FC } from "react";
import {
  OakTypography,
  OakFlex,
  OakIcon,
  OakIconName,
} from "@oaknational/oak-components";

import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import Card from "@/components/SharedComponents/Card";
import { PositionProps } from "@/styles/utils/position";
import { DisplayProps } from "@/styles/utils/display";

type TeachersTabResourceSelectorCardProps = {
  icon: OakIconName;
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
      <OakFlex $gap="spacing-16">
        <OakFlex
          $height={"100%"}
          $width={"fit-content"}
          $background={"bg-success"}
          $pa="spacing-8"
        >
          <OakIcon
            iconName={icon}
            $height="spacing-48"
            $width="spacing-48"
            $colorFilter={"text-inverted"}
            alt=""
          />
        </OakFlex>
        <OakFlex $height={"100%"} $alignItems={"center"}>
          <OakTypography $font={"heading-light-7"} $color={"text-primary"}>
            {title}
          </OakTypography>
        </OakFlex>
      </OakFlex>
      <BoxBorders $color={"text-primary"} gapPosition={"rightTop"} />
    </Card>
  );
};

export default TeachersTabResourceSelectorCard;
