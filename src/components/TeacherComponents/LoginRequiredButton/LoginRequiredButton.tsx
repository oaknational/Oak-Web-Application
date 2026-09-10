import { SignInButton } from "@clerk/nextjs";
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
import { ReactNode, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

import { resolveOakHref } from "@/common-lib/urls";
import { useComplexCopyright } from "@/hooks/useComplexCopyright";

type ButtonState =
  | "loading"
  | "action"
  | "onboarding"
  | "signup"
  | "georestricted"
  | "null";

type ActionProps = {
  onClick?: () => void | Promise<void>;
  name: ReactNode;
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
  rel?: string;
  returnToAnchor?: string; // anchor target id to return to after sign in / onboarding
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

const getRedirectUrl = (
  path: string | null,
  returnToAnchor: string | undefined,
) => {
  let returnTo = "";
  if (path) {
    returnTo += path;
    if (returnToAnchor) {
      returnTo += `#${returnToAnchor}`;
    }
  }
  const query = returnTo ? { returnTo } : undefined;

  return resolveOakHref({
    page: "onboarding",
    query,
  });
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
    returnToAnchor,
    ...overrideProps
  } = props;
  const router = useRouter();
  const path = usePathname();
  const {
    showSignedInNotOnboarded,
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
    showGeoBlocked,
    isLoaded,
  } = useComplexCopyright({
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
          onClick={() => {
            router.push(getRedirectUrl(path, returnToAnchor));
          }}
          {...overrideProps}
        >
          {onboardingProps?.name ?? "Complete sign up to continue"}
        </ButtonComponent>
      );
    case "signup":
      return (
        <SignInButton
          forceRedirectUrl={getRedirectUrl(path, returnToAnchor)}
          signUpForceRedirectUrl={getRedirectUrl(path, returnToAnchor)}
        >
          <ButtonComponent
            iconName={signUpProps?.iconName}
            isTrailingIcon={signUpProps?.isTrailingIcon}
            {...overrideProps}
          >
            <OakFlex $alignItems="center" $gap="spacing-12">
              {signUpProps?.showNewTag && (
                <OakTagFunctional
                  label="New"
                  $background="bg-decorative1-main"
                  $color="text-primary"
                  $pv={"spacing-0"}
                />
              )}
              {signUpProps?.name ?? "Sign up"}
            </OakFlex>
          </ButtonComponent>
        </SignInButton>
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
            <OakFlex $alignItems="center" $gap="spacing-12">
              {actionProps?.showNewTag && !actionProps?.loading && (
                <OakTagFunctional
                  label="New"
                  $background="bg-decorative1-main"
                  $color="text-primary"
                  $pv={"spacing-0"}
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
