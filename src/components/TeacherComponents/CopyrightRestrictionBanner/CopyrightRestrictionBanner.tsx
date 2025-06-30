import { SignUpButton, useUser } from "@clerk/nextjs";
import {
  OakFlex,
  OakLink,
  OakIcon,
  OakP,
  OakSecondaryLink,
  OakSpan,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";
import styled from "styled-components";

import { resolveOakHref } from "@/common-lib/urls";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";
import useAnalytics from "@/context/Analytics/useAnalytics";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

export type CopyrightRestrictionBannerProps = {
  isGeorestricted?: boolean;
  isLoginRequired?: boolean;
  componentType?: ComponentTypeValueType;
  unitName?: string | null;
  unitSlug?: string | null;
  lessonName?: string | null;
  lessonSlug?: string | null;
  lessonReleaseDate?: string | null;
  isLessonLegacy?: boolean;
};

const StyledFlex = styled(OakFlex)`
  max-width: 80%;

  @media (max-width: 1280px) {
    max-width: 70%;
  }
  @media (max-width: 750px) {
    max-width: 100%;
  }
`;

const SignedOutCopyrightBanner = ({
  showOnboardingLink,
  isGeorestricted,
  isUnit,
}: {
  showOnboardingLink: boolean;
  isGeorestricted: boolean;
  isUnit: boolean;
}) => {
  const router = useRouter();

  return (
    <OakFlex
      $background={"bg-neutral"}
      $ba={"border-solid-s"}
      $borderColor={"border-neutral-lighter"}
      $borderRadius={"border-radius-l"}
      $justifyContent={"space-between"}
      $alignItems={["flex-end", "center"]}
      $gap={"space-between-m"}
      $pa={"inner-padding-m"}
      $maxWidth={"all-spacing-23"}
      $flexDirection={["column", "row"]}
      data-testid="copyright-banner-signed-out"
    >
      <StyledFlex
        $justifyContent={"space-between"}
        $alignItems={["flex-start", "center"]}
        $gap={"space-between-xs"}
      >
        <OakIcon iconName={"copyright"} />
        <OakP $font={"heading-light-7"} $color={"text-primary"}>
          <OakSpan $font={"heading-7"} $color={"text-primary"}>
            Copyrighted materials:{" "}
          </OakSpan>
          to view and download resources from this {isUnit ? "unit" : "lesson"},
          you’ll need to {isGeorestricted && `be in the UK and `}
          {showOnboardingLink ? (
            <OakSecondaryLink
              data-testid="copyright-banner-onboarding-link"
              onClick={() =>
                router.push({
                  pathname: resolveOakHref({ page: "onboarding" }),
                  query: { returnTo: router.asPath },
                })
              }
            >
              sign in.
            </OakSecondaryLink>
          ) : (
            <SignUpButton
              forceRedirectUrl={`/onboarding?returnTo=${router.asPath}`}
            >
              <OakSecondaryLink data-testid="copyright-banner-signin-link">
                sign in.
              </OakSecondaryLink>
            </SignUpButton>
          )}
        </OakP>
      </StyledFlex>
      <OakSecondaryLink
        href="http://support.thenational.academy/what-is-copyright-and-signing-in"
        isTrailingIcon
        iconName={"external"}
      >
        <OakSpan $font={"heading-light-7"} $color={"text-primary"}>
          Copyrights help
        </OakSpan>
      </OakSecondaryLink>
    </OakFlex>
  );
};

const SignedInGeorestrictedBanner = ({ isUnit }: { isUnit: boolean }) => (
  <OakFlex
    $background={"bg-decorative3-very-subdued"}
    $ba={"border-solid-s"}
    $borderColor={"border-decorative3-stronger"}
    $borderRadius={"border-radius-l"}
    $flexDirection={"column"}
    $justifyContent={"space-between"}
    $alignItems={"flex-start"}
    $gap={"space-between-s"}
    $pa={"inner-padding-xl"}
    $maxWidth={"all-spacing-23"}
    data-testid="copyright-banner-signed-in"
  >
    <OakP $font={["heading-7", "heading-5"]} $color={"text-primary"}>
      Sorry but this {isUnit ? "unit" : "lesson"} can only be downloaded if you
      are located in the UK.
    </OakP>
    <OakP $font={["body-2", "body-1"]} $color={"text-primary"}>
      Some of our content is restricted to the UK due to copyright. You can{" "}
      <OakLink href="http://support.thenational.academy/what-is-copyright-and-signing-in">
        read more about copyrights
      </OakLink>{" "}
      or if you believe this is an error and you’re based in the UK, please{" "}
      <OakLink href="https://share.hsforms.com/1CK8Y0vv-TuOeBbDac-CMTgbvumd">
        contact us.
      </OakLink>
    </OakP>
  </OakFlex>
);

const CopyrightRestrictionBanner = (props: CopyrightRestrictionBannerProps) => {
  const {
    isGeorestricted,
    isLoginRequired,
    componentType,
    unitName,
    unitSlug,
    lessonName,
    lessonSlug,
    lessonReleaseDate,
    isLessonLegacy,
  } = props;

  const { user, isSignedIn } = useUser();
  const { track } = useAnalytics();

  const showOnboardingLink = !!(user && !user.publicMetadata?.owa?.isOnboarded);
  const isUserRegionRestricted = !!(
    user && !user?.publicMetadata?.owa?.isRegionAuthorised
  );
  const isLegacy = unitSlug ? isSlugLegacy(unitSlug) : isLessonLegacy;
  const isUnit = (componentType && componentType === "lesson_listing") ?? false;

  if (isSignedIn && isGeorestricted && isUserRegionRestricted) {
    track.contentBlockNotificationDisplayed({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "explore",
      componentType:
        componentType ?? (isUnit ? "lesson_listing" : "lesson_overview"),
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      lessonName: lessonName ?? null,
      lessonSlug: lessonSlug ?? null,
      lessonReleaseCohort: isLegacy ? "2020-2023" : "2023-2026",
      lessonReleaseDate: lessonReleaseDate ?? null,
      unitName: unitName ?? null,
      unitSlug: unitSlug ?? null,
      contentType: isUnit ? "unit" : "lesson",
      accessBlockType: "Geo-restriction",
      accessBlockDetails: {},
    });
  }

  return (
    <>
      {(!isSignedIn || (isSignedIn && showOnboardingLink)) &&
      (isGeorestricted || isLoginRequired) ? (
        <SignedOutCopyrightBanner
          showOnboardingLink={showOnboardingLink}
          isGeorestricted={!!isGeorestricted}
          isUnit={!!isUnit}
        />
      ) : isSignedIn && isGeorestricted && isUserRegionRestricted ? (
        <SignedInGeorestrictedBanner isUnit={!!isUnit} />
      ) : null}
    </>
  );
};

export default CopyrightRestrictionBanner;
