import {
  OakFlex,
  OakHeading,
  OakP,
  OakImage,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import styled from "styled-components";

import LoginRequiredButton from "../LoginRequiredButton/LoginRequiredButton";

import { resolveOakHref } from "@/common-lib/urls";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

type RestrictedContentPromptProps = {
  showGeoBlocked?: boolean;
  programmeSlug?: string | null;
  lessonSlug?: string;
  unitSlug?: string | null;
  isCanonical?: boolean;
};

const FlexWithMaxWidth = styled(OakFlex)`
  max-width: 600px;
`;

const SignInPrompt = () => (
  <>
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
            materials, you'll need to sign in. This ensures we’re both staying
            within the rules.
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
  </>
);

const GeoblockedPrompt = ({
  programmeSlug,
  lessonSlug,
  unitSlug,
  isCanonical,
}: {
  programmeSlug?: string | null;
  lessonSlug?: string;
  unitSlug?: string | null;
  isCanonical?: boolean;
}) => (
  <>
    <OakFlex $flexDirection={"column"} $gap={"space-between-m2"}>
      <OakHeading tag="h2" $font={"heading-5"}>
        Sorry but this content is only available in the UK.
      </OakHeading>
      <OakP $font={"body-1"}>
        Some of our content is restricted to the UK due to copyright. You can
        read more about copyrights or if you believe this is an error and you’re
        based in the UK, please contact us.
      </OakP>
    </OakFlex>
    {programmeSlug && unitSlug && lessonSlug && !isCanonical && (
      <OakPrimaryButton
        element="a"
        href={resolveOakHref({
          page: "lesson-overview",
          programmeSlug,
          lessonSlug,
          unitSlug,
        })}
        width={"100%"}
      >
        Back to lesson
      </OakPrimaryButton>
    )}
    {isCanonical && lessonSlug && (
      <OakPrimaryButton
        element="a"
        href={resolveOakHref({
          page: "lesson-overview-canonical",
          lessonSlug,
        })}
        width={"100%"}
      >
        Back to lesson
      </OakPrimaryButton>
    )}
  </>
);

export function RestrictedContentPrompt({
  showGeoBlocked,
  programmeSlug,
  lessonSlug,
  unitSlug,
  isCanonical,
}: RestrictedContentPromptProps) {
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
        {showGeoBlocked ? (
          <GeoblockedPrompt
            programmeSlug={programmeSlug}
            lessonSlug={lessonSlug}
            unitSlug={unitSlug}
            isCanonical={isCanonical}
          />
        ) : (
          <SignInPrompt />
        )}
      </FlexWithMaxWidth>
    </OakFlex>
  );
}
