import { FC } from "react";
import {
  OakP,
  OakIcon,
  OakUiRoleToken,
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
  background: OakUiRoleToken;
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
      $minHeight={"spacing-360"}
      $width={"spacing-360"}
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
        $maxWidth={"spacing-360"}
        $alignItems={"center"}
        $flexDirection={"column"}
        $zIndex={"in-front"}
        $pa={"spacing-12"}
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
          $mh={["spacing-12", "spacing-0"]}
          $textAlign={"center"}
          $font={["heading-5", "heading-4"]}
        >
          {heading}
        </OakP>
        <OakBox $mt={["spacing-8", "spacing-4"]} $maxWidth={"spacing-240"}>
          <OakP
            $mh={["spacing-32", "spacing-0"]}
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
