import { SignUpButton, useUser } from "@clerk/nextjs";
import { OakPrimaryButton } from "@oaknational/oak-components";
import { useRouter } from "next/router";
import { useMemo } from "react";

import { resolveOakHref } from "@/common-lib/urls";

type ButtonState = "loading" | "action" | "onboarding" | "signup";

const OakSignUpButton = () => {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();

  const buttonState = useMemo((): ButtonState => {
    const userOnboarded = user?.publicMetadata?.owa?.isOnboarded;
    if (isLoaded && !isSignedIn) {
      return "signup";
    }
    if (isLoaded && isSignedIn && !userOnboarded) {
      return "onboarding";
    }
    if (isLoaded && isSignedIn && userOnboarded) {
      return "action";
    }
    return "loading";
  }, [isLoaded, isSignedIn, user]);

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
          <OakPrimaryButton>Sign up</OakPrimaryButton>
        </SignUpButton>
      );
    default:
      return <OakPrimaryButton isLoading>Loading...</OakPrimaryButton>;
  }
};

export default OakSignUpButton;
