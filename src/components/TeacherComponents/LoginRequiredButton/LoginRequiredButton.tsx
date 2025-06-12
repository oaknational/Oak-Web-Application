import { SignUpButton, useUser } from "@clerk/nextjs";
import {
  OakFlex,
  OakIconName,
  OakLoadingSpinner,
  OakPrimaryButton,
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

type ButtonState =
  | "loading"
  | "action"
  | "onboarding"
  | "signup"
  | "georestricted"
  | "null";

type ActionProps = {
  onClick: () => void;
  name: string;
  iconName?: OakIconName;
  isTrailingIcon?: boolean;
  isActionGeorestricted: boolean;
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

type LoginRequiredButtonProps = {
  actionProps?: ActionProps;
  signUpProps?: SignUpProps;
  onboardingProps?: OnboardingProps;
  buttonVariant?: ButtonVariant;
  sizeVariant?: SizeVariant;
};

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
  } = props;
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();

  const buttonState = useMemo((): ButtonState => {
    const userOnboarded = user?.publicMetadata?.owa?.isOnboarded;

    if (!isLoaded) {
      return "loading";
    } else if (!isSignedIn) {
      return "signup";
    } else if (isSignedIn && !userOnboarded) {
      return "onboarding";
    } else if (userOnboarded && actionProps) {
      if (
        actionProps.isActionGeorestricted &&
        !user?.publicMetadata?.owa?.isRegionAuthorised
      ) {
        return "georestricted";
      }
      return "action";
    } else {
      return "null";
    }
  }, [isLoaded, isSignedIn, user, actionProps]);

  const ButtonComponent = getButtonVariant(buttonVariant, sizeVariant);

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
        <ButtonComponent
          onClick={actionProps?.onClick}
          iconName={actionProps?.iconName}
          isTrailingIcon={actionProps?.isTrailingIcon}
          disabled={buttonState === "georestricted"}
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
      );
    case "loading":
      return <ButtonComponent isLoading>Loading...</ButtonComponent>;
    default:
      return null;
  }
};

export default LoginRequiredButton;
