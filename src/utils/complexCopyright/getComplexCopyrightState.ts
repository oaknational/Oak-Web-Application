import { AuthState, ComplexCopyrightStatus } from "./complexCopyright.types";

export const getComplexCopyrightState = ({
  authState,
  resourceIsGeorestricted,
  resourceRequiresLogin,
}: {
  authState: AuthState;
  resourceIsGeorestricted: boolean;
  resourceRequiresLogin: boolean;
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
    isLoaded: true,
    isResourceGeorestricted: resourceIsGeorestricted,
  };
};
