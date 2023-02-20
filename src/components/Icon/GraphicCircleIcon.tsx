import { FC } from "react";

import Icon, { IconName } from "../Icon";
import Circle from "../Circle";
import { FlexProps } from "../Flex";
import { OakColorName } from "../../styles/theme";

type GraphicCircleIconProps = FlexProps & {
  icon: IconName;
  $background?: OakColorName;
  hasDropShadow?: boolean;
  isHovered?: boolean;
};

const GraphicCircleIcon: FC<GraphicCircleIconProps> = ({
  icon,
  $background = "teachersPastelYellow",
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
