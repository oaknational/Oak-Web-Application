import {
  ClerkProvider,
  RedirectToSignIn,
  RedirectToSignUp,
  SignedIn,
  SignedOut,
  SignOutButton,
  useUser,
} from "@clerk/nextjs";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { PropsWithChildren, createContext, useContext } from "react";

function EmptyComponent() {
  return null;
}
EmptyComponent.displayName = "EmptyComponent";

const realClerkApi = {
  useUser,
  SignedIn,
  SignedOut,
  SignOutButton,
  RedirectToSignIn,
  RedirectToSignUp,
};
type ClerkApi = typeof realClerkApi;

export const fakeClerkApi: ClerkApi = {
  useUser: () => ({
    isLoaded: false,
    isSignedIn: undefined,
    user: undefined,
  }),
  SignedIn: EmptyComponent,
  SignedOut: EmptyComponent,
  SignOutButton: EmptyComponent,
  RedirectToSignIn: EmptyComponent,
  RedirectToSignUp: EmptyComponent,
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
