import { ComponentType, PropsWithChildren } from "react";
import { RedirectToSignUp, useUser } from "@clerk/nextjs";

/**
 * Wraps a component or page in a check for the presence
 * of a signed-in user. If the user is not signed-in they are redirected
 * to the sign-in page
 */
export function withPageAuthRequired<P extends object>(
  Component: ComponentType<P>,
  FallbackComponent?: ComponentType<PropsWithChildren>,
) {
  function WrappedComponent(props: Readonly<P>) {
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
      return <RedirectToSignUp />;
    }

    return null;
  }
  WrappedComponent.displayName = `${Component.displayName}WithPageAuthRequired`;

  return WrappedComponent;
}
