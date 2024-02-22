import { FC } from "react";
import { OakP } from "@oaknational/oak-components";

import { OakColorName } from "@/styles/theme/types";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading";
import Svg from "@/components/SharedComponents/Svg";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";
import Box from "@/components/SharedComponents/Box";

type SupportYourTeamBubbleMessageProps = {
  outlineHeading: string;
  heading: string;
  subHeading: string;
  variant: "bubble-1" | "bubble-2";
  background: OakColorName;
};

const SupportYourTeamBubbleMessage: FC<
  SupportYourTeamBubbleMessageProps & FlexProps
> = ({
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
          <OakP>{outlineHeading}</OakP>
        </OutlineHeading>
        <OakP
          $mh={["space-between-xs", "space-between-none"]}
          // @todo
          // $mt={-20}
          $textAlign={"center"}
          $font={["heading-5", "heading-4"]}
        >
          {heading}
        </OakP>
        <Box $mt={[8, 4]} $maxWidth={300}>
          <OakP
            $mh={["space-between-m2", "space-between-none"]}
            $textAlign={"center"}
            $font={["heading-light-7", "heading-light-6"]}
          >
            {subHeading}
          </OakP>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SupportYourTeamBubbleMessage;
