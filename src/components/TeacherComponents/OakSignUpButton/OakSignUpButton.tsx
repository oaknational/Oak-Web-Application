import { SignUpButton, useUser } from "@clerk/nextjs";
import {
  OakIconName,
  OakPrimaryButton,
  OakSecondaryButton,
  OakSmallPrimaryButton,
  OakSmallSecondaryButton,
  OakSmallTertiaryInvertedButton,
  OakTertiaryButton,
} from "@oaknational/oak-components";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { resolveOakHref } from "@/common-lib/urls";

type ButtonState = "loading" | "action" | "onboarding" | "signup" | "null";

type ActionProps = {
  onClick: () => void;
  name: string;
  iconName?: OakIconName;
  isTrailingIcon?: boolean;
};

type SignUpProps = {
  buttonName?: string;
  iconName?: OakIconName;
  isTrailingIcon?: boolean;
};

type ButtonVariant = "primary" | "secondary" | "tertiary";

type OakSignUpButtonProps = {
  actionProps?: ActionProps;
  signUpProps?: SignUpProps;
  buttonVariant?: ButtonVariant;
  smallButton?: boolean;
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

const OakSignUpButton = (props: OakSignUpButtonProps) => {
  const {
    actionProps,
    signUpProps,
    buttonVariant = "primary",
    smallButton = false,
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
          Complete sign up to continue
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
      return (
        <ButtonComponent
          onClick={actionProps?.onClick}
          iconName={actionProps?.iconName}
          isTrailingIcon={actionProps?.isTrailingIcon}
        >
          {actionProps?.name}
        </ButtonComponent>
      );
    case "loading":
      return <ButtonComponent isLoading>Loading...</ButtonComponent>;
    default:
      return null;
  }
};

export default OakSignUpButton;
