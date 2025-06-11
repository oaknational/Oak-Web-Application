import { SignUpButton, useUser } from "@clerk/nextjs";
import { OakIconName, OakPrimaryButton } from "@oaknational/oak-components";
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

type OakSignUpButtonProps = {
  actionProps?: ActionProps;
  signInText?: string;
};

const OakSignUpButton = (props: OakSignUpButtonProps) => {
  const { actionProps, signInText } = props;
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

  switch (buttonState) {
    case "onboarding":
      return (
        <OakPrimaryButton
          onClick={() =>
            router.push({
              pathname: resolveOakHref({ page: "onboarding" }),
              query: { returnTo: router.asPath },
            })
          }
        >
          Complete sign up to continue
        </OakPrimaryButton>
      );
    case "signup":
      return (
        <SignUpButton
          forceRedirectUrl={`/onboarding?returnTo=${router.asPath}`}
        >
          <OakPrimaryButton>{signInText ?? "Sign up"}</OakPrimaryButton>
        </SignUpButton>
      );
    case "action":
      return (
        <OakPrimaryButton
          onClick={actionProps?.onClick}
          iconName={actionProps?.iconName}
          isTrailingIcon={actionProps?.isTrailingIcon}
        >
          {actionProps?.name}
        </OakPrimaryButton>
      );
    case "loading":
      return <OakPrimaryButton isLoading>Loading...</OakPrimaryButton>;
    default:
      return null;
  }
};

export default OakSignUpButton;
