import { FC } from "react";

import { PixelSpacing } from "../../styles/theme";
import { ResponsiveValues } from "../../styles/utils/responsive";
import Flex, { FlexProps } from "../Flex";

type CircleProps = FlexProps & {
  size: ResponsiveValues<PixelSpacing>;
};
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
