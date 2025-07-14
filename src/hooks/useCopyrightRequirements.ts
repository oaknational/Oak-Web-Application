import { useUser } from "@clerk/nextjs";
import { useFeatureFlagEnabled } from "posthog-js/react";

interface UseCopyrightRequirementsProps {
  loginRequired: boolean;
  geoRestricted: boolean;
}

interface UseCopyrightRequirementsReturn {
  showSignedOutLoginRequired: boolean;
  showSignedOutGeoRestricted: boolean;
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

  if (!featureFlagEnabled) {
    return {
      showGeoBlocked: false,
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
    };
  }

  const userRegionAuthorised =
    user?.publicMetadata?.owa?.isRegionAuthorised ?? false;

  return {
    showSignedOutLoginRequired: !isSignedIn && loginRequired,
    showSignedOutGeoRestricted: !isSignedIn && geoRestricted,
    showGeoBlocked: Boolean(
      isSignedIn && geoRestricted && !userRegionAuthorised,
    ),
  };
}
