import {
  OakFlex,
  OakHeading,
  OakP,
  OakImage,
} from "@oaknational/oak-components";
import styled from "styled-components";

import LoginRequiredButton from "../LoginRequiredButton/LoginRequiredButton";

import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

const FlexWithMaxWidth = styled(OakFlex)`
  max-width: 600px;
`;

export function RestrictedContentPrompt() {
  return (
    <OakFlex
      $flexDirection={"column"}
      $alignItems={"center"}
      $justifyContent={"center"}
      $pa={["inner-padding-none", "inner-padding-xl2"]}
      $pv={["inner-padding-none", "inner-padding-xl8"]}
      $height={"100%"}
      $background={["bg-primary", "mint"]}
      $color={"text-primary"}
    >
      <FlexWithMaxWidth
        $flexDirection={"column"}
        $gap={"space-between-xl"}
        $alignItems={"start"}
        $pa={"inner-padding-xl4"}
        $borderRadius={"border-radius-l"}
        $background={"bg-primary"}
      >
        <OakFlex
          $flexDirection={"row"}
          $justifyContent={"space-between"}
          $alignItems={"center"}
          $alignSelf={"stretch"}
        >
          <OakFlex
            $flexDirection={"column"}
            $gap={"space-between-m2"}
            $alignItems={"start"}
            $maxWidth={"all-spacing-20"}
          >
            <OakHeading tag="h2">Sign in to continue</OakHeading>
            <OakFlex $flexDirection={"column"} $gap={"space-between-m"}>
              <OakP $font={"body-2"}>
                Our content remains 100% free, but to access certain copyrighted
                materials, you'll need to sign in. This ensures we’re both
                staying within the rules.
              </OakP>
              <OakP $font={"body-2-bold"}>
                P.S. Signing in also gives you more ways to make the most of Oak
                like unit downloads!
              </OakP>
            </OakFlex>
          </OakFlex>
          <OakImage
            $height={"all-spacing-19"}
            $width={"all-spacing-19"}
            alt="An illustration of a hijabi teacher writing on a whiteboard"
            src={getCloudinaryImageUrl(
              "v1751281170/svg-illustrations/teacher-02_illustration_2_ge95qf.svg",
            )}
          />
        </OakFlex>
        <LoginRequiredButton width={"100%"} />
      </FlexWithMaxWidth>
    </OakFlex>
  );
}
