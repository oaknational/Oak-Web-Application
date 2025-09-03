import { SignUpButton } from "@clerk/nextjs";
import {
  OakBox,
  OakFlex,
  OakIconName,
  OakLoadingSpinner,
  OakPrimaryButton,
  OakPrimaryButtonProps,
  OakSecondaryButton,
  OakSmallPrimaryButton,
  OakSmallSecondaryButton,
  OakSmallTertiaryInvertedButton,
  OakTagFunctional,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { resolveOakHref } from "@/common-lib/urls";
import { useCopyrightRequirements } from "@/hooks/useCopyrightRequirements";

type ButtonState =
  | "loading"
  | "action"
  | "onboarding"
  | "signup"
  | "georestricted"
  | "null";

type ActionProps = {
  onClick?: () => void | Promise<void>;
  name: string;
  isActionGeorestricted: boolean;
  shouldHidewhenGeoRestricted?: boolean;
  href?: string;
  iconName?: OakIconName;
  isTrailingIcon?: boolean;
  loading?: boolean;
  showNewTag?: boolean;
};

type SignUpProps = {
  name?: string;
  iconName?: OakIconName;
  isTrailingIcon?: boolean;
  showNewTag?: boolean;
};

type OnboardingProps = {
  name: string;
};

type ButtonVariant = "primary" | "secondary" | "tertiary";
type SizeVariant = "small" | "large";

type BaseProps = {
  geoRestricted: boolean;
  loginRequired: boolean;
  actionProps?: ActionProps;
  signUpProps?: SignUpProps;
  onboardingProps?: OnboardingProps;
  buttonVariant?: ButtonVariant;
  sizeVariant?: SizeVariant;
  element?: "a" | "button";
};

type LoginRequiredButtonProps = BaseProps & OakPrimaryButtonProps;

const getButtonVariant = (variant: ButtonVariant, sizeVariant: SizeVariant) => {
  switch (variant) {
    case "primary":
      return sizeVariant === "small" ? OakSmallPrimaryButton : OakPrimaryButton;
    case "secondary":
      return sizeVariant === "small"
        ? OakSmallSecondaryButton
        : OakSecondaryButton;
    case "tertiary":
      return sizeVariant === "small"
        ? OakSmallTertiaryInvertedButton
        : OakTertiaryButton;

    default:
      return OakPrimaryButton;
  }
};

const LoginRequiredButton = (props: LoginRequiredButtonProps) => {
  const {
    actionProps,
    signUpProps,
    onboardingProps,
    buttonVariant = "primary",
    sizeVariant = "large",
    element = "button",
    loginRequired,
    geoRestricted,
    ...overrideProps
  } = props;
  const router = useRouter();
  const {
    showSignedInNotOnboarded,
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
    showGeoBlocked,
    isLoaded,
  } = useCopyrightRequirements({
    loginRequired,
    geoRestricted,
  });

  const contentRestricted = loginRequired || geoRestricted;
  const buttonState = useMemo((): ButtonState => {
    if (contentRestricted && !isLoaded) {
      return "loading";
    } else if (showSignedOutGeoRestricted || showSignedOutLoginRequired) {
      return "signup";
    } else if (showSignedInNotOnboarded) {
      return "onboarding";
    } else if (actionProps) {
      if (showGeoBlocked) {
        return "georestricted";
      }
      return "action";
    } else {
      return "null";
    }
  }, [
    contentRestricted,
    isLoaded,
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
    showSignedInNotOnboarded,
    actionProps,
    showGeoBlocked,
  ]);

  const ButtonComponent = getButtonVariant(buttonVariant, sizeVariant);

  const shouldHideButton =
    showGeoBlocked && actionProps?.shouldHidewhenGeoRestricted;

  switch (buttonState) {
    case "onboarding":
      return (
        <ButtonComponent
          onClick={() =>
            router.push({
              pathname: resolveOakHref({ page: "onboarding" }),
              query: { returnTo: router.asPath },
            })
          }
          {...overrideProps}
        >
          {onboardingProps?.name ?? "Complete sign up to continue"}
        </ButtonComponent>
      );
    case "signup":
      return (
        <SignUpButton
          forceRedirectUrl={`/onboarding?returnTo=${router.asPath}`}
        >
          <ButtonComponent
            iconName={signUpProps?.iconName}
            isTrailingIcon={signUpProps?.isTrailingIcon}
            {...overrideProps}
          >
            <OakFlex $alignItems="center" $gap="space-between-xs">
              {signUpProps?.showNewTag && (
                <OakTagFunctional
                  label="New"
                  $background="mint"
                  $color="text-primary"
                  $pv={"inner-padding-none"}
                />
              )}
              {signUpProps?.name ?? "Sign up"}
            </OakFlex>
          </ButtonComponent>
        </SignUpButton>
      );
    case "action":
    case "georestricted":
      return (
        <OakBox $display={shouldHideButton ? "none" : "block"}>
          <ButtonComponent
            element={element}
            onClick={actionProps?.onClick}
            iconName={actionProps?.iconName}
            href={actionProps?.href}
            isTrailingIcon={actionProps?.isTrailingIcon}
            disabled={buttonState === "georestricted"}
            {...overrideProps}
          >
            <OakFlex $alignItems="center" $gap="space-between-xs">
              {actionProps?.showNewTag && !actionProps?.loading && (
                <OakTagFunctional
                  label="New"
                  $background="mint"
                  $color="text-primary"
                  $pv={"inner-padding-none"}
                />
              )}
              {actionProps?.loading && (
                <OakLoadingSpinner data-testid="loading-spinner" />
              )}
              {actionProps?.name}
            </OakFlex>
          </ButtonComponent>
        </OakBox>
      );
    case "loading":
      return (
        <ButtonComponent isLoading {...overrideProps}>
          Loading...
        </ButtonComponent>
      );
    default:
      return null;
  }
};

export default LoginRequiredButton;
