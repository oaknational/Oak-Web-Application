import { ComponentType, PropsWithChildren } from "react";

import { useFeatureFlaggedClerk } from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

/**
 * Wraps a component or page in a check for the presence
 * of a signed-in user. If the user is not signed-in they are redirected
 * to the sign-in page
 */
export function withPageAuthRequired<P extends object>(
  Component: ComponentType<P>,
  FallbackComponent?: ComponentType<PropsWithChildren>,
) {
  function WrappedComponent(props: P) {
    const { useUser, RedirectToSignIn } = useFeatureFlaggedClerk();
    const { isSignedIn, isLoaded } = useUser();

    if (!isLoaded) {
      if (FallbackComponent) {
        return (
          <FallbackComponent>
            <Component {...props} />
          </FallbackComponent>
        );
      }

      return null;
    }

    if (isSignedIn) {
      return <Component {...props} />;
    }

    if (!isSignedIn) {
      console.log("diego not signed in - redirecting to sign in");
      return <RedirectToSignIn />;
    }

    return null;
  }
  WrappedComponent.displayName = `${Component.displayName}WithPageAuthRequired`;

  return WrappedComponent;
}
