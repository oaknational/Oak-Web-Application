import { User } from "@clerk/nextjs/server";

import { AuthState } from "./complexCopyright.types";

import { UserResource } from "clerk";

export const getAuthState = ({
  isSignedIn,
  user,
}: {
  isSignedIn: boolean | undefined;
  user: UserResource | User | null | undefined;
}): AuthState => {
  return {
    isSignedIn: !!isSignedIn,
    isOnboarded:
      (isSignedIn && user?.publicMetadata?.owa?.isOnboarded) ?? false,
    isRegionAuthorised: user?.publicMetadata?.owa?.isRegionAuthorised !== false,
  };
};
