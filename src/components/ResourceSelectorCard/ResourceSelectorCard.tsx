import { FC } from "react";

import Card from "../Card/Card";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders/BoxBorders";
import Icon from "../Icon/Icon";
import { IconName } from "../Icon";
import Flex from "../Flex/Flex";
import Typography from "../Typography/Typography";

import { PositionProps } from "@/styles/utils/position";
import { DisplayProps } from "@/styles/utils/display";

type ResourceSelectorCardProps = {
  icon: IconName;
  title: string;
  angle: number;
} & Omit<PositionProps, "$gap"> &
  DisplayProps;
const ResourceSelectorCard: FC<ResourceSelectorCardProps> = (props) => {
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
      <Flex $gap={16}>
        <Flex
          $height={"100%"}
          $width={"fit-content"}
          $background={"oakGreen"}
          $pa={8}
        >
          {" "}
          <Icon name={icon} $objectPosition={"center"} size={50} $pa={3} />
        </Flex>
        <Flex $height={"100%"} $alignItems={"center"}>
          <Typography $font={"heading-light-7"} $color={"black"}>
            {title}
          </Typography>
        </Flex>
      </Flex>

      <BoxBorders $color={"black"} gapPosition={"rightTop"} />
    </Card>
  );
};

export default ResourceSelectorCard;
