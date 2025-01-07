import { FC } from "react";
import {
  OakP,
  OakIcon,
  OakColorFilterToken,
  OakBox,
  OakFlex,
  OakFlexProps,
} from "@oaknational/oak-components";

import OutlineHeading from "@/components/SharedComponents/OutlineHeading";

type SupportYourTeamBubbleMessageProps = {
  outlineHeading: string;
  heading: string;
  subHeading: string;
  variant: "bubble-1" | "bubble-2";
  background: OakColorFilterToken;
};

const SupportYourTeamBubbleMessage: FC<
  SupportYourTeamBubbleMessageProps & OakFlexProps
> = ({
  outlineHeading,
  heading,
  subHeading,
  variant,
  background,
  ...props
}) => {
  return (
    <OakFlex
      $alignItems={"center"}
      $flexDirection={"column"}
      $position={"relative"}
      $minHeight={"all-spacing-20"}
      $width={"all-spacing-20"}
      $justifyContent={"center"}
      {...props}
    >
      <OakIcon
        iconName={variant}
        $colorFilter={background}
        $objectFit={"fill"}
        $position={"absolute"}
        $width={"100%"}
        $height={"100%"}
      />
      <OakFlex
        $maxWidth={"all-spacing-20"}
        $alignItems={"center"}
        $flexDirection={"column"}
        $zIndex={"in-front"}
        $pa={"inner-padding-s"}
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
          $textAlign={"center"}
          $font={["heading-5", "heading-4"]}
        >
          {heading}
        </OakP>
        <OakBox
          $mt={["space-between-ssx", "space-between-sssx"]}
          $maxWidth={"all-spacing-19"}
        >
          <OakP
            $mh={["space-between-m2", "space-between-none"]}
            $textAlign={"center"}
            $font={["heading-light-7", "heading-light-6"]}
          >
            {subHeading}
          </OakP>
        </OakBox>
      </OakFlex>
    </OakFlex>
  );
};

export default SupportYourTeamBubbleMessage;
