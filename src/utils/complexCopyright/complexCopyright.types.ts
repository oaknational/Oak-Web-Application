export interface AuthState {
  isSignedIn: boolean;
  isOnboarded: boolean;
  isRegionAuthorised: boolean;
}

export interface ComplexCopyrightStatus {
  showSignedOutLoginRequired: boolean;
  showSignedOutGeoRestricted: boolean;
  showSignedInNotOnboarded: boolean;
  showGeoBlocked: boolean;
  isLoaded: boolean;
  isResourceGeorestricted: boolean;
}
