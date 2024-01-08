import { FC } from "react";

import Icon, { IconName } from ".";

import Circle from "@/components/Circle";
import { OakColorName } from "@/styles/theme";
import { FlexProps } from "@/components/SharedComponents/Flex";

type GraphicCircleIconProps = FlexProps & {
  icon: IconName;
  $background?: OakColorName;
  hasDropShadow?: boolean;
  isHovered?: boolean;
};

const GraphicCircleIcon: FC<GraphicCircleIconProps> = ({
  icon,
  $background = "lemon50",
  hasDropShadow = true,
  isHovered,
}) => (
  <Circle
    size={72}
    $background={$background}
    $dropShadow={hasDropShadow ? "grey20" : "none"}
    $transform={isHovered ? "scale(1.1)" : null}
    $transition={"all 0.3s ease"}
  >
    <Icon $pa={0} size={48} name={icon} />
  </Circle>
);

export default GraphicCircleIcon;
