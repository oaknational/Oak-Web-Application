import {
  OakFlex,
  OakHeading,
  OakP,
  OakImage,
  OakPrimaryButton,
  OakLink,
} from "@oaknational/oak-components";
import styled from "styled-components";

import LoginRequiredButton from "../LoginRequiredButton/LoginRequiredButton";

import { resolveOakHref } from "@/common-lib/urls";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import {
  COPYRIGHT_CONTACT_US_LINK,
  COPYRIGHT_SUPPORT_LINK,
} from "@/utils/copyrightLinks";

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
        $gap={"spacing-32"}
        $alignItems={"start"}
        $maxWidth={"spacing-360"}
      >
        <OakHeading tag="h2">Sign in to continue</OakHeading>
        <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
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
        $height={"spacing-240"}
        $width={"spacing-240"}
        alt="An illustration of a hijabi teacher writing on a whiteboard"
        src={getCloudinaryImageUrl(
          "v1751281170/svg-illustrations/teacher-02_illustration_2_ge95qf.svg",
        )}
      />
    </OakFlex>
    <LoginRequiredButton
      loginRequired={true}
      geoRestricted={true}
      width={"100%"}
    />
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
    <OakFlex $flexDirection={"column"} $gap={"spacing-32"}>
      <OakHeading tag="h2" $font={"heading-5"}>
        Sorry but this content is only available in the UK.
      </OakHeading>
      <OakP $font={"body-1"}>
        Some of our content is restricted to the UK due to copyright. You can{" "}
        <OakLink href={COPYRIGHT_SUPPORT_LINK}>
          read more about copyrights
        </OakLink>{" "}
        or if you believe this is an error and you’re based in the UK, please{" "}
        <OakLink href={COPYRIGHT_CONTACT_US_LINK}>contact us.</OakLink>
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
}: Readonly<RestrictedContentPromptProps>) {
  return (
    <OakFlex
      $flexDirection={"column"}
      $alignItems={"center"}
      $justifyContent={"center"}
      $pa={["spacing-0", "spacing-32"]}
      $pv={["spacing-0", "spacing-80"]}
      $height={"100%"}
      $background={["bg-primary", "mint"]}
      $color={"text-primary"}
    >
      <FlexWithMaxWidth
        $flexDirection={"column"}
        $gap={"spacing-56"}
        $alignItems={"start"}
        $pa={"spacing-48"}
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
