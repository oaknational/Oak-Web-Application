import { FC } from "react";

import { PixelSpacing } from "@/styles/theme";
import { ResponsiveValues } from "@/styles/utils/responsive";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";

export type CircleProps = FlexProps & {
  children?: React.ReactNode;
  size: ResponsiveValues<PixelSpacing>;
  $alignItems?: FlexProps["$alignItems"];
  $justifyContent?: FlexProps["$justifyContent"];
  $borderRadius?: FlexProps["$borderRadius"];
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
  const {
    size,
    $alignItems = "center",
    $justifyContent = "center",
    $borderRadius = "50%",
    ...flexProps
  } = props;

  return (
    <Flex
      {...flexProps}
      $alignItems={$alignItems}
      $justifyContent={$justifyContent}
      $borderRadius={$borderRadius}
      $width={size}
      $minWidth={size}
      $height={size}
      $minHeight={size}
    />
  );
};

export default Circle;
