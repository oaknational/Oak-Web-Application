import { FC } from "react";

import Flex, { FlexProps } from "../Flex";
import Svg from "../Svg";
import { Span } from "../Typography";
import { OakColorName } from "../../styles/theme/types";

export const tagWidthMap = {
  small: 44,
  large: 56,
} as const;

export const tagFontMap = {
  small: "body-4",
  large: "heading-7",
} as const;

type TagWithMap = keyof typeof tagWidthMap;

type TagPromotionalProps = {
  $color?: OakColorName;
  size?: TagWithMap;
} & FlexProps;

const TagPromotional: FC<TagPromotionalProps> = ({
  $color = "white",
  size = "large",
  ...flexProps
}) => {
  return (
    <Flex
      $zIndex={"inFront"}
      $height={[18, 50]}
      $minWidth={[tagWidthMap.small, tagWidthMap.large]}
      $position={"relative"}
      {...flexProps}
    >
      <Svg
        $width={tagWidthMap[size]}
        $color={"oakGrey6"}
        $position={"absolute"}
        name={"tag-promotional"}
        $bottom={1}
      />
      <Flex
        $left={[size == "large" ? 12 : 8, size == "large" ? 8 : 6]}
        $top={[-2, size == "large" ? 12 : 14]}
        $position={"absolute"}
      >
        <Span $color={$color} $font={["body-4", tagFontMap[size]]}>
          New
        </Span>
      </Flex>
    </Flex>
  );
};

export default TagPromotional;
