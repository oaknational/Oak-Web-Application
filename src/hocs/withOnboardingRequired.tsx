import { ComponentType, PropsWithChildren } from "react";

import { useRequireOnboarding } from "@/hooks/useRequireOnboarding";
import { useFeatureFlaggedClerk } from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";

/**
 * Makes the user onboard before they can proceed to the page
 */
export function withOnboardingRequired<P extends object>(
  Component: ComponentType<P>,
  FallbackComponent?: ComponentType<PropsWithChildren>,
) {
  function WrappedComponent(props: Readonly<P>) {
    const { useUser } = useFeatureFlaggedClerk();
    useRequireOnboarding();

    if (!useUser().user?.publicMetadata?.owa?.isOnboarded) {
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
