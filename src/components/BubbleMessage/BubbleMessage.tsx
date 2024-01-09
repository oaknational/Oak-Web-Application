import { FC } from "react";

import Box from "../Box";
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
        $width={320}
        $alignItems={"center"}
        $flexDirection={"column"}
        $zIndex={"inFront"}
      >
        <OutlineHeading
          $mb={[12, 0]}
          tag={"div"}
          $fontSize={[60, 100]}
          $fontWeight={600}
        >
          {outlineHeading}
        </OutlineHeading>

        <Heading $mh={[12, 0]} $mt={-20} $textAlign={"center"} tag={"h3"}>
          <Span $font={["heading-5", "heading-4"]}>{heading}</Span>
          <Box $mt={[8, 4]} $textAlign={"center"} $maxWidth={300}>
            <Span
              $mh={[30, 0]}
              $textAlign={"center"}
              $font={["heading-light-7", "heading-light-6"]}
            >
              {subHeading}
            </Span>
          </Box>
        </Heading>
      </Flex>
    </Flex>
  );
};

export default BubbleMessage;
