import { useEffect } from "react";
import { SignUpButton } from "@clerk/nextjs";
import {
  OakLink,
  OakP,
  OakSecondaryLink,
  OakSpan,
  OakInlineBanner,
  OakSmallTertiaryInvertedButton,
} from "@oaknational/oak-components";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { resolveOakHref } from "@/common-lib/urls";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";
import useAnalytics from "@/context/Analytics/useAnalytics";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import {
  COPYRIGHT_CONTACT_US_LINK,
  COPYRIGHT_SUPPORT_LINK,
} from "@/utils/copyrightLinks";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";

export type ComplexCopyrightRestrictionBannerProps = {
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

const SignedOutCopyrightBanner = ({
  showOnboardingLink,
  isGeorestricted,
  isUnit,
}: {
  showOnboardingLink: boolean;
  isGeorestricted: boolean;
  isUnit: boolean;
}) => {
  const pathname = usePathname();

  return (
    <OakInlineBanner
      isOpen
      type="neutral"
      icon="copyright"
      $maxWidth={"spacing-960"}
      data-testid="copyright-banner-signed-out"
      cta={
        <OakSmallTertiaryInvertedButton
          element={Link}
          href={COPYRIGHT_SUPPORT_LINK}
          isTrailingIcon
          iconName={"external"}
        >
          <OakSpan $font={"heading-light-7"} $color={"text-primary"}>
            Copyrights help
          </OakSpan>
        </OakSmallTertiaryInvertedButton>
      }
      message={
        <OakP $font={"heading-light-7"} $color={"text-primary"}>
          <OakSpan $font={"heading-7"} $color={"text-primary"}>
            Copyrighted materials:{" "}
          </OakSpan>
          to view and download resources from this {isUnit ? "unit" : "lesson"},
          you’ll need to {isGeorestricted && `be in the UK and `}
          {showOnboardingLink ? (
            <OakSecondaryLink
              data-testid="copyright-banner-onboarding-link"
              href={resolveOakHref({
                page: "onboarding",
                query: { returnTo: pathname ?? "" },
              })}
            >
              complete sign up.
            </OakSecondaryLink>
          ) : (
            <SignUpButton
              forceRedirectUrl={`/onboarding?returnTo=${pathname ?? ""}`}
            >
              <OakSecondaryLink
                data-testid="copyright-banner-signin-link"
                element="button"
              >
                sign in.
              </OakSecondaryLink>
            </SignUpButton>
          )}
        </OakP>
      }
    />
  );
};

const SignedInGeorestrictedBanner = ({ isUnit }: { isUnit: boolean }) => (
  <OakInlineBanner
    type="info"
    $maxWidth={"spacing-960"}
    data-testid="copyright-banner-signed-in"
    isOpen
    icon="globe"
    title={`Sorry but ${
      isUnit
        ? "this unit can only be downloaded if you are located"
        : "this lesson is only available"
    } in the UK.`}
    message={
      <OakP $font={"body-2"} $color={"text-primary"}>
        Some of our content is restricted to the UK due to copyright. You can{" "}
        <OakLink href={COPYRIGHT_SUPPORT_LINK}>
          read more about copyrights
        </OakLink>{" "}
        or if you believe this is an error and you’re based in the UK, please{" "}
        <OakLink href={COPYRIGHT_CONTACT_US_LINK}>contact us.</OakLink>
      </OakP>
    }
  />
);

const ComplexCopyrightRestrictionBanner = (
  props: ComplexCopyrightRestrictionBannerProps,
) => {
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

  const {
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
    showSignedInNotOnboarded,
    showGeoBlocked,
  } = useComplexCopyright({
    loginRequired: isLoginRequired ?? false,
    geoRestricted: isGeorestricted ?? false,
  });

  const { track } = useAnalytics();

  const isLegacy = unitSlug ? isSlugLegacy(unitSlug) : isLessonLegacy;
  const isUnit = (componentType && componentType === "lesson_listing") ?? false;

  useEffect(() => {
    if (showGeoBlocked) {
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
  }, [
    track,
    componentType,
    unitName,
    unitSlug,
    lessonName,
    lessonSlug,
    lessonReleaseDate,
    isLegacy,
    isUnit,
    showGeoBlocked,
  ]);

  const showSignedOutCopyrightBanner =
    showSignedOutGeoRestricted ||
    showSignedOutLoginRequired ||
    showSignedInNotOnboarded;

  return showGeoBlocked ? (
    <SignedInGeorestrictedBanner isUnit={isUnit} />
  ) : showSignedOutCopyrightBanner ? (
    <SignedOutCopyrightBanner
      showOnboardingLink={showSignedInNotOnboarded}
      isGeorestricted={isGeorestricted ?? false}
      isUnit={isUnit}
    />
  ) : null;
};

export default ComplexCopyrightRestrictionBanner;
