import { AuthState, ComplexCopyrightStatus } from "./complexCopyright.types";

export const getComplexCopyrightState = ({
  authState,
  resourceIsGeorestricted,
  resourceRequiresLogin,
  isLoaded,
}: {
  authState: AuthState;
  resourceIsGeorestricted: boolean;
  resourceRequiresLogin: boolean;
  isLoaded: boolean;
}): ComplexCopyrightStatus => {
  const showSignedOutLoginRequired =
    !authState.isSignedIn && resourceRequiresLogin;

  const showSignedOutGeoRestricted =
    !authState.isSignedIn && resourceIsGeorestricted;

  const showSignedInNotOnboarded =
    authState.isSignedIn &&
    !authState.isOnboarded &&
    (resourceRequiresLogin || resourceIsGeorestricted);

  const showGeoBlocked =
    authState.isSignedIn &&
    resourceIsGeorestricted &&
    !authState.isRegionAuthorised;

  return {
    showSignedOutLoginRequired,
    showSignedOutGeoRestricted,
    showSignedInNotOnboarded,
    showGeoBlocked,
    isLoaded,
    isResourceGeorestricted: resourceIsGeorestricted,
  };
};
