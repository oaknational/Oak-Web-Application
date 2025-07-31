import { useUser } from "@clerk/nextjs";
import { useFeatureFlagEnabled } from "posthog-js/react";

interface UseCopyrightRequirementsProps {
  loginRequired: boolean;
  geoRestricted: boolean;
  isBehindFeatureFlag?: boolean;
}

export interface UseCopyrightRequirementsReturn {
  showSignedOutLoginRequired: boolean;
  showSignedOutGeoRestricted: boolean;
  showSignedInNotOnboarded: boolean;
  showGeoBlocked: boolean;
  isLoaded: boolean;
}

export function useCopyrightRequirements({
  loginRequired,
  geoRestricted,
  isBehindFeatureFlag = true,
}: UseCopyrightRequirementsProps): UseCopyrightRequirementsReturn {
  const { user, isSignedIn, isLoaded } = useUser();
  const featureFlagEnabled = useFeatureFlagEnabled(
    "teachers-copyright-restrictions",
  );

  const isUserOnboarded =
    (isSignedIn && user?.publicMetadata?.owa?.isOnboarded) ?? false;

  if (isBehindFeatureFlag && !featureFlagEnabled) {
    return {
      showGeoBlocked: false,
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      isLoaded,
    };
  }

  const showSignedInNotOnboarded =
    !isUserOnboarded && (loginRequired || geoRestricted);
  const isUserRegionAuthorised =
    user?.publicMetadata?.owa?.isRegionAuthorised !== false;

  return {
    showSignedOutLoginRequired: !isSignedIn && loginRequired,
    showSignedOutGeoRestricted: !isSignedIn && geoRestricted,
    showGeoBlocked: Boolean(
      isSignedIn && geoRestricted && !isUserRegionAuthorised,
    ),
    showSignedInNotOnboarded,
    isLoaded,
  };
}
