import { FC } from "react";

import Flex, { FlexProps } from "../Flex";
import Svg from "../Svg";
import { Span } from "../Typography";

import { OakColorName } from "@/styles/theme/types";

const tagDimMap = {
  small: {
    width: 44,
    height: 20,
  },
  medium: {
    width: 46,
    height: 22,
  },
  large: {
    width: 58,
    height: 34,
  },
} as const;

const textPosMap = {
  small: {
    left: 8,
    bottom: 4,
  },
  medium: {
    left: 6,
    bottom: 3,
  },
  large: {
    left: 10,
    bottom: 10,
  },
} as const;

const tagFontMap = {
  small: "body-4",
  medium: "body-3",
  large: "heading-7",
} as const;

type TagWithMap = keyof typeof tagDimMap;

type TagPromotionalProps = FlexProps & {
  $color?: OakColorName;
  size?: TagWithMap;
};

const TagPromotional: FC<TagPromotionalProps> = ({
  $color = "white",
  size = "large",
  ...props
}) => {
  return (
    <Flex
      $zIndex={"inFront"}
      $width={tagDimMap[size].width}
      $height={tagDimMap[size].height}
      $position={"relative"}
      {...props}
    >
      <Svg
        $color={"oakGrey6"}
        $position={"absolute"}
        name={"tag-promotional"}
        $bottom={1}
        $objectFit={"contain"}
        filter={"drop-shadow(2px 2px 0px rgb(255 255 255 / 0.6))"}
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
