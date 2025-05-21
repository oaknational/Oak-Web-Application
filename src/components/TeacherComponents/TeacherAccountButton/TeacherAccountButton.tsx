import { UserButton, SignUpButton } from "@clerk/nextjs";
import {
  oakColorTokens,
  OakSmallSecondaryButton,
} from "@oaknational/oak-components";
import { FC } from "react";

import { getBreakpoint } from "@/styles/utils/responsive";

const TeacherAccountButton: FC<{
  isSignedIn: boolean;
  onboardingRedirectUrl: string;
}> = ({ isSignedIn, onboardingRedirectUrl }) => {
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
  }

  return (
    <SignUpButton forceRedirectUrl={onboardingRedirectUrl}>
      <OakSmallSecondaryButton>Sign up</OakSmallSecondaryButton>
    </SignUpButton>
  );
};

export default TeacherAccountButton;
