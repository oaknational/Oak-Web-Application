import { FC } from "react";

import { PixelSpacing } from "../../styles/theme";
import { ResponsiveValues } from "../../styles/utils/responsive";
import Flex, { FlexProps } from "../Flex";

export type CircleProps = FlexProps & {
  size: ResponsiveValues<PixelSpacing>;
};
/**
 * Circle is a simple wrapper round Flex which takes a size: PixelValue,
 * sets border-radius at 50% and centers its contents by default.
 *
 * ## Usage
 *
 * Use it where you need a container which is a circle.
 */
const Circle: FC<CircleProps> = (props) => {
  const { size, ...flexProps } = props;

  return <Flex {...flexProps} $width={size} $height={size} />;
};

Circle.defaultProps = {
  $alignItems: "center",
  $justifyContent: "center",
  $borderRadius: "50%",
};

export default Circle;
