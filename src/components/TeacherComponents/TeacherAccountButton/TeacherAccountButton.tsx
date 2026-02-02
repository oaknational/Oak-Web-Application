import { UserButton, SignUpButton, useUser } from "@clerk/nextjs";
import {
  oakColorTokens,
  OakSmallPrimaryButton,
  OakSmallSecondaryButton,
} from "@oaknational/oak-components";
import { FC } from "react";

import { getBreakpoint } from "@/styles/utils/responsive";
import { SelectedArea } from "@/components/AppComponents/AppHeader/AppHeader";

/**
 * This component displays either:
 * - A UserButton (avatar) when a user is signed in, providing account management options
 * - A SignUpButton for teachers who aren't logged in
 * - Nothing for non-teachers who aren't logged in
 */
const TeacherAccountButton: FC<{
  selectedArea: SelectedArea;
  onboardingRedirectUrl: string;
  buttonVariant: "primary" | "secondary";
}> = ({ selectedArea, onboardingRedirectUrl, buttonVariant }) => {
  const { isSignedIn } = useUser();
  const ButtonVariant =
    buttonVariant === "primary"
      ? OakSmallPrimaryButton
      : OakSmallSecondaryButton;
  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          elements: {
            userButtonAvatarBox: {
              [`@media (max-width: ${getBreakpoint("small")}px)`]: {
                width: "100%",
                maxWidth: "100%",
              },
            },
            userButtonTrigger: {
              "&:focus": {
                boxShadow: `0px 0px 0px 2px ${oakColorTokens.lemon}, 0px 0px 0px 5px ${oakColorTokens.grey60} !important`,
              },
            },
            userButtonPopoverCard: {
              [`@media (max-width: ${getBreakpoint("small")}px)`]: {
                width: "100%",
                maxWidth: "100%",
                marginLeft: "0",
              },
            },
          },
        }}
        data-testid="clerk-user-button"
      />
    );
  } else if (selectedArea === "TEACHERS") {
    return (
      <SignUpButton forceRedirectUrl={onboardingRedirectUrl}>
        <ButtonVariant $font={"body-3-bold"}>Sign up</ButtonVariant>
      </SignUpButton>
    );
  }

  return null;
};

export default TeacherAccountButton;
