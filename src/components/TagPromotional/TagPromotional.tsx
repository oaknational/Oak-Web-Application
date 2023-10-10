import { FC } from "react";

import Flex, { FlexProps } from "../Flex";
import Svg from "../Svg";
import { Span } from "../Typography";

import { OakColorName } from "@/styles/theme/types";

const tagDimMap = {
  small: {
    width: 48,
    height: 22,
  },
  medium: {
    width: 52,
    height: 26,
  },
  large: {
    width: 60,
    height: 34,
  },
} as const;

const textPosMap = {
  small: {
    left: 7,
    bottom: 2,
  },
  medium: {
    left: 9,
    bottom: 5,
  },
  large: {
    left: 10,
    bottom: 9,
  },
} as const;

const tagFontMap = {
  small: "body-3-bold",
  medium: "body-3-bold",
  large: "heading-7",
} as const;

type TagWithMap = keyof typeof tagDimMap;

type TagPromotionalProps = FlexProps & {
  $color?: OakColorName;
  size?: TagWithMap;
} & FlexProps;

const TagPromotional: FC<TagPromotionalProps> = ({
  $color = "lemon",
  size = "large",
  ...flexProps
}) => {
  return (
    <Flex
      $zIndex={"inFront"}
      $width={tagDimMap[size].width}
      $height={tagDimMap[size].height}
      $position={"relative"}
      {...flexProps}
    >
      <Svg
        $color={"oakGrey6"}
        name={"tag-promotional"}
        filter={"drop-shadow(2px 2px 0px rgb(255 255 255 / 0.6))"}
        $objectFit={"contain"}
      />
      <Flex
        $left={textPosMap[size].left}
        $bottom={textPosMap[size].bottom}
        $position={"absolute"}
      >
        <Span $color={$color} $font={tagFontMap[size]}>
          New
        </Span>
      </Flex>
    </Flex>
  );
};

export default TagPromotional;
