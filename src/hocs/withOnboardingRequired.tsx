import { ComponentType, PropsWithChildren } from "react";
import { useUser } from "@clerk/nextjs";

import { useRequireOnboarding } from "@/hooks/useRequireOnboarding";

/**
 * Makes the user onboard before they can proceed to the page
 */
export function withOnboardingRequired<P extends object>(
  Component: ComponentType<P>,
  FallbackComponent?: ComponentType<PropsWithChildren>,
) {
  function WrappedComponent(props: Readonly<P>) {
    useRequireOnboarding();
    const { isSignedIn, user } = useUser();
    const isOnboarded = user?.publicMetadata?.owa?.isOnboarded;

    if (isSignedIn && !isOnboarded) {
      if (FallbackComponent) {
        return (
          <FallbackComponent>
            <Component {...props} />
          </FallbackComponent>
        );
      }

      return null;
    }

    return <Component {...props} />;
  }
  WrappedComponent.displayName = `${Component.displayName}WithOnboardingRequired`;

  return WrappedComponent;
}
