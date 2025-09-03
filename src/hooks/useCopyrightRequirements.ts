import { useUser } from "@clerk/nextjs";

interface UseCopyrightRequirementsProps {
  loginRequired: boolean;
  geoRestricted: boolean;
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
}: UseCopyrightRequirementsProps): UseCopyrightRequirementsReturn {
  const { user, isSignedIn, isLoaded } = useUser();

  const isUserOnboarded =
    (isSignedIn && user?.publicMetadata?.owa?.isOnboarded) ?? false;

  const showSignedInNotOnboarded = Boolean(
    !isUserOnboarded && (loginRequired || geoRestricted) && isSignedIn,
  );
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
