import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { PropsWithChildren, createContext, useContext } from "react";

export type ClerkApi = {
  useUser: typeof useUser;
  SignedIn: typeof SignedIn;
  SignedOut: typeof SignedOut;
  SignOutButton: typeof SignOutButton;
};

function EmptySignedOutButton() {
  return null;
}
EmptySignedOutButton.displayName = "EmptySignedOutButton";

const realClerkApi: ClerkApi = {
  useUser,
  SignedIn,
  SignedOut,
  SignOutButton,
};
export const fakeClerkApi: ClerkApi = {
  useUser: () => ({
    isLoaded: false,
    isSignedIn: undefined,
    user: undefined,
  }),
  SignedIn: () => null,
  SignedOut: () => null,
  SignOutButton: EmptySignedOutButton,
};

const clerkApiContext = createContext<ClerkApi>(fakeClerkApi);

export function useFeatureFlaggedClerk() {
  return useContext(clerkApiContext);
}

/**
 * Loads Clerk when the feature flag is enabled
 *
 * NB: Clerk hooks and components must be accessed through `useFeatureFlaggedClerk` to avoid
 * a missing provider error when the flag is disabled
 *
 * TODO remove this abstraction once the `use-auth-owa` feature flag is retired
 */
export function FeatureFlaggedClerkProvider({ children }: PropsWithChildren) {
  if (useFeatureFlagEnabled("use-auth-owa")) {
    return (
      <ClerkProvider>
        <clerkApiContext.Provider value={realClerkApi}>
          {children}
        </clerkApiContext.Provider>
      </ClerkProvider>
    );
  }

  return <>{children}</>;
}
