import { ComponentProps, useEffect } from "react";
import { SignUpButton } from "@clerk/nextjs";
import {
  OakLink,
  OakP,
  OakSpan,
  OakInlineBanner,
  OakSmallTertiaryInvertedButton,
} from "@oaknational/oak-components";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

import { resolveOakHref } from "@/common-lib/urls";
import { ComponentType, ComponentTypeValueType } from "@/browser-lib/avo/Avo";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import {
  COPYRIGHT_CONTACT_US_LINK,
  COPYRIGHT_SUPPORT_LINK,
} from "@/utils/copyrightLinks";
import { useComplexCopyright } from "@/utils/complexCopyright/useComplexCopyright";
import { ComplexCopyrightStatus } from "@/utils/complexCopyright/complexCopyright.types";

type InnerCopyrightBannerProps = Omit<
  ComponentProps<typeof OakInlineBanner>,
  "message" | "isOpen"
>;
export type ComplexCopyrightRestrictionBannerProps =
  InnerCopyrightBannerProps & {
    isGeorestricted?: boolean;
    isLoginRequired?: boolean;
    componentType?: ComponentTypeValueType;
    copyrightState?: ComplexCopyrightStatus;
  };

const SignedOutCopyrightBanner = ({
  showOnboardingLink,
  isGeorestricted,
  isUnit,
  onSignInClick,
  ...rest
}: InnerCopyrightBannerProps & {
  showOnboardingLink: boolean;
  isGeorestricted: boolean;
  isUnit: boolean;
  onSignInClick: () => void;
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnTo =
    pathname && searchParams ? pathname + "?" + searchParams.toString() : "";

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
          Copyrights help
        </OakSmallTertiaryInvertedButton>
      }
      message={
        <OakP $font={"body-3"} $color={"text-primary"}>
          <OakSpan $font={"body-3-bold"} $color={"text-primary"}>
            Copyrighted materials:{" "}
          </OakSpan>
          to view and download resources from this {isUnit ? "unit" : "lesson"},
          you’ll need to {isGeorestricted && `be in the UK and `}
          {showOnboardingLink ? (
            <OakLink
              variant="secondary"
              data-testid="copyright-banner-onboarding-link"
              href={resolveOakHref({
                page: "onboarding",
                query: { returnTo },
              })}
            >
              complete sign up.
            </OakLink>
          ) : (
            <SignUpButton forceRedirectUrl={`/onboarding?returnTo=${returnTo}`}>
              <OakLink
                variant="secondary"
                data-testid="copyright-banner-signin-link"
                element="button"
                onClick={onSignInClick}
              >
                sign in.
              </OakLink>
            </SignUpButton>
          )}
        </OakP>
      }
      {...rest}
    />
  );
};

const SignedInGeorestrictedBanner = ({
  isUnit,
  ...rest
}: InnerCopyrightBannerProps & {
  isUnit: boolean;
}) => (
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
    {...rest}
  />
);

const ComplexCopyrightRestrictionBanner = (
  props: ComplexCopyrightRestrictionBannerProps,
) => {
  const {
    isGeorestricted,
    isLoginRequired,
    componentType,
    copyrightState: suppliedCopyrightState,
    ...rest
  } = props;

  const clientCopyrightState = useComplexCopyright({
    geoRestricted: isGeorestricted ?? false,
    loginRequired: isLoginRequired ?? false,
  });

  const {
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
    showSignedInNotOnboarded,
    showGeoBlocked,
    isResourceGeorestricted,
  } = suppliedCopyrightState ?? clientCopyrightState;

  const { contentBlockNotificationDisplayed, signInStarted } =
    useTeacherBrowseAnalytics((store) => store.track);

  const isUnit = (componentType && componentType === "lesson_listing") ?? false;

  useEffect(() => {
    if (showGeoBlocked) {
      contentBlockNotificationDisplayed({
        componentType:
          componentType ?? (isUnit ? "lesson_listing" : "lesson_overview"),
        accessBlockType: "Geo-restriction",
      });
    }
  }, [
    contentBlockNotificationDisplayed,
    componentType,
    isUnit,
    showGeoBlocked,
  ]);

  const showSignedOutCopyrightBanner =
    showSignedOutGeoRestricted ||
    showSignedOutLoginRequired ||
    showSignedInNotOnboarded;

  if (showGeoBlocked) {
    return <SignedInGeorestrictedBanner isUnit={isUnit} {...rest} />;
  }

  return showSignedOutCopyrightBanner ? (
    <SignedOutCopyrightBanner
      showOnboardingLink={showSignedInNotOnboarded}
      isGeorestricted={isResourceGeorestricted}
      isUnit={isUnit}
      onSignInClick={() =>
        signInStarted({
          componentType: ComponentType.COMPLEX_COPYRIGHT_RESTRICTION_BANNER,
        })
      }
      {...rest}
    />
  ) : null;
};

export default ComplexCopyrightRestrictionBanner;
