import { FC } from "react";

import { OakColorName } from "@/styles/theme/types";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading";
import Svg from "@/components/SharedComponents/Svg";
import { P } from "@/components/SharedComponents/Typography";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";

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
        $maxWidth={320}
        $alignItems={"center"}
        $flexDirection={"column"}
        $zIndex={"inFront"}
      >
        <OutlineHeading
          $mb={[12, 48]}
          $mt={[0, 48]}
          tag={"div"}
          $fontSize={[60, 100]}
          $font={"heading-1"}
        >
          <P>{outlineHeading}</P>
        </OutlineHeading>
        <P
          $mh={[12, 0]}
          $mt={-20}
          $textAlign={"center"}
          $font={["heading-5", "heading-4"]}
        >
          {heading}
        </P>
        <Box $mt={[8, 4]} $maxWidth={300}>
          <P
            $mh={[30, 0]}
            $textAlign={"center"}
            $font={["heading-light-7", "heading-light-6"]}
          >
            {subHeading}
          </P>
        </Box>
      </Flex>
    </Flex>
  );
};

export default BubbleMessage;
