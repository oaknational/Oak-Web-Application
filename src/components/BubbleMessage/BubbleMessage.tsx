import { FC } from "react";

import Flex, { FlexProps } from "../Flex";
import OutlineHeading from "../OutlineHeading";
import Svg from "../Svg";
import { Heading, Span } from "../Typography";
import { OakColorName } from "../../styles/theme/types";

type BubbleMessageProps = {
  outlineHeading: string;
  heading: string;
  subHeading: string;
  variant: "bubble-1" | "bubble-2";
  background: OakColorName;
};

const BubbleMessage: FC<BubbleMessageProps & FlexProps> = ({
  outlineHeading,
  heading,
  subHeading,
  variant,
  background,
  ...props
}) => {
  return (
    <Flex
      $alignItems={"center"}
      $flexDirection={"column"}
      $position={"relative"}
      $minHeight={360}
      $width={380}
      $justifyContent={"center"}
      {...props}
    >
      <Svg name={variant} $color={background} $cover />
      <Flex
        $maxWidth={300}
        $alignItems={"center"}
        $flexDirection={"column"}
        $zIndex={"inFront"}
      >
        <Heading $mh={[12, 0]} $mt={-20} $textAlign={"center"} tag={"h3"}>
          <OutlineHeading
            $mb={[12, 0]}
            tag={"span"}
            $fontSize={[60, 100]}
            $fontWeight={600}
          >
            {outlineHeading}
          </OutlineHeading>
          <br />
          <Span $font={["heading-5", "heading-4"]}>{heading}</Span>
          <br />
          <Span
            $mh={[30, 0]}
            $textAlign={"center"}
            $font={["heading-light-7", "heading-light-6"]}
          >
            {subHeading}
          </Span>
        </Heading>
      </Flex>
    </Flex>
  );
};

export default BubbleMessage;
