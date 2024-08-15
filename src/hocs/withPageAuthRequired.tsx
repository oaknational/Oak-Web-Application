import { ComponentType } from "react";

import { useFeatureFlaggedClerk } from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

/**
 * Wraps a component or page in a check for the presence
 * of a signed-in user. If the user is not signed-in they are redirected
 * to the sign-in page
 */
export function withPageAuthRequired<P extends object>(
  Component: ComponentType<P>,
) {
  function WrappedComponent(props: P) {
    const { useUser, RedirectToSignIn } = useFeatureFlaggedClerk();
    const { isSignedIn, isLoaded } = useUser();

    if (!isLoaded) {
      return null;
    }

    if (isSignedIn) {
      return <Component {...props} />;
    }

    if (!isSignedIn) {
      return <RedirectToSignIn />;
    }

    return null;
  }
  WrappedComponent.displayName = `${Component.displayName}WithPageAuthRequired`;

  return WrappedComponent;
}
