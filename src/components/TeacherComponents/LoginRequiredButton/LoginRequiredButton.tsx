import { SignUpButton, useUser } from "@clerk/nextjs";
import {
  OakFlex,
  OakIconName,
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
};

type SignUpProps = {
  buttonName?: string;
  iconName?: OakIconName;
  isTrailingIcon?: boolean;
};

type ButtonVariant = "primary" | "secondary" | "tertiary";

type LoginRequiredButtonProps = {
  actionProps?: ActionProps;
  signUpProps?: SignUpProps;
  buttonVariant?: ButtonVariant;
  smallButton?: boolean;
  showNewTag?: boolean;
};

const getButtonVariant = (variant: ButtonVariant, smallButton: boolean) => {
  switch (variant) {
    case "primary":
      return smallButton ? OakSmallPrimaryButton : OakPrimaryButton;
    case "secondary":
      return smallButton ? OakSmallSecondaryButton : OakSecondaryButton;
    case "tertiary":
      return smallButton ? OakSmallTertiaryInvertedButton : OakTertiaryButton;
    default:
      return OakPrimaryButton;
  }
};

const LoginRequiredButton = (props: LoginRequiredButtonProps) => {
  const {
    actionProps,
    signUpProps,
    buttonVariant = "primary",
    smallButton = false,
    showNewTag = false,
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

  const ButtonComponent = getButtonVariant(buttonVariant, smallButton);

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
          <OakFlex $alignItems="center" $gap="space-between-xs">
            {showNewTag && (
              <OakTagFunctional
                label="New"
                $background="mint"
                $color="text-primary"
                $pv={"inner-padding-none"}
              />
            )}
            Complete sign up to continue
          </OakFlex>
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
            {signUpProps?.buttonName ?? "Sign up"}
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
            {showNewTag && (
              <OakTagFunctional
                label="New"
                $background="mint"
                $color="text-primary"
                $pv={"inner-padding-none"}
              />
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
