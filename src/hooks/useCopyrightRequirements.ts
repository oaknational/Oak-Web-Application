import { useUser } from "@clerk/nextjs";
import { useFeatureFlagEnabled } from "posthog-js/react";

interface UseCopyrightRequirementsProps {
  loginRequired: boolean;
  geoRestricted: boolean;
}

export interface UseCopyrightRequirementsReturn {
  showSignedOutLoginRequired: boolean;
  showSignedOutGeoRestricted: boolean;
  showSignedInNotOnboarded: boolean;
  showGeoBlocked: boolean;
}

export function useCopyrightRequirements({
  loginRequired,
  geoRestricted,
}: UseCopyrightRequirementsProps): UseCopyrightRequirementsReturn {
  const { user, isSignedIn } = useUser();
  const featureFlagEnabled = useFeatureFlagEnabled(
    "teachers-copyright-restrictions",
  );

  const isUserOnboarded =
    (isSignedIn && user?.publicMetadata?.owa?.isOnboarded) ?? false;

  if (!featureFlagEnabled) {
    return {
      showGeoBlocked: false,
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
    };
  }

  const showSignedInNotOnboarded =
    !isUserOnboarded && (loginRequired || geoRestricted);
  const isUserRegionAuthorised =
    user?.publicMetadata?.owa?.isRegionAuthorised ?? false;

  return {
    showSignedOutLoginRequired: !isSignedIn && loginRequired,
    showSignedOutGeoRestricted: !isSignedIn && geoRestricted,
    showGeoBlocked: Boolean(
      isSignedIn && geoRestricted && !isUserRegionAuthorised,
    ),
    showSignedInNotOnboarded,
  };
}
