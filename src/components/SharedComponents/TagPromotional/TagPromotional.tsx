import { FC } from "react";
import { OakSpan, OakColorToken, OakIcon } from "@oaknational/oak-components";

import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";

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
  $color?: OakColorToken;
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
      data-testid={`new-icon`}
      {...flexProps}
    >
      <OakIcon
        iconName="tag-promotional"
        $width={"100%"}
        $height={"100%"}
        $objectFit={"cover"}
        aria-hidden={true}
        data-testid={`tag-promotional-icon`}
      />
      <Flex
        $left={textPosMap[size].left}
        $bottom={textPosMap[size].bottom}
        $position={"absolute"}
      >
        <OakSpan $color={$color} $font={tagFontMap[size]}>
          New
        </OakSpan>
      </Flex>
    </Flex>
  );
};

export default TagPromotional;
