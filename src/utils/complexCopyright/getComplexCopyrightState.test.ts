import { getComplexCopyrightState } from "./getComplexCopyrightState";

const signedOutAuthState = {
  isSignedIn: false,
  isOnboarded: false,
  isRegionAuthorised: false,
};
const signedInGeorestrictedAuthState = {
  isSignedIn: true,
  isOnboarded: true,
  isRegionAuthorised: false,
};
const signedInGeoAuthenticatedAuthState = {
  isSignedIn: true,
  isOnboarded: true,
  isRegionAuthorised: true,
};

describe("getComplexCopyrightState", () => {
  it("returns the correct state when signed out with resource not restricted and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedOutAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: false,
    });
  });

  it("returns the correct state when signed out with resource not georestricted but login required", () => {
    const result = getComplexCopyrightState({
      authState: signedOutAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: true,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: false,
    });
  });

  it("returns the correct state when signed out with georestricted resource and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedOutAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: true,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: true,
    });
  });

  it("returns the correct state when signed out with georestricted resource and login required", () => {
    const result = getComplexCopyrightState({
      authState: signedOutAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: true,
      showSignedOutGeoRestricted: true,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: true,
    });
  });

  it("returns the correct state when signed in but georestricted with resource not restricted and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeorestrictedAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: false,
    });
  });

  it("returns the correct state when signed in but georestricted with resource not restricted but login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeorestrictedAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: false,
    });
  });

  it("returns the correct state when signed in but georestricted with georestricted resource and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeorestrictedAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: true,
      isLoaded: true,
      isResourceGeorestricted: true,
    });
  });

  it("returns the correct state when signed in but georestricted with georestricted resource and login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeorestrictedAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: true,
      isLoaded: true,
      isResourceGeorestricted: true,
    });
  });

  it("returns the correct state when signed in and geo-authenticated with resource not restricted and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeoAuthenticatedAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: false,
    });
  });

  it("returns the correct state when signed in and geo-authenticated with resource not restricted but login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeoAuthenticatedAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: false,
    });
  });

  it("returns the correct state when signed in and geo-authenticated with georestricted resource and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeoAuthenticatedAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: true,
    });
  });

  it("returns the correct state when signed in and geo-authenticated with georestricted resource and login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeoAuthenticatedAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual({
      showSignedOutLoginRequired: false,
      showSignedOutGeoRestricted: false,
      showSignedInNotOnboarded: false,
      showGeoBlocked: false,
      isLoaded: true,
      isResourceGeorestricted: true,
    });
  });
});
