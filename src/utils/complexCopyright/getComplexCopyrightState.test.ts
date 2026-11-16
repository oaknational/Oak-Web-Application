import { getComplexCopyrightState } from "./getComplexCopyrightState";

import {
  signedOutLoginRequired,
  signedInGeoBlocked,
  signedOutGeoRestricted,
  signedInNotOnboarded,
  defaultCopyrightRequirements,
} from "@/__tests__/__helpers__/mockCopyrightRequirements";

const signedOutAuthState = {
  isSignedIn: false,
  isOnboarded: false,
  isRegionAuthorised: false,
};
const signedInNotOnboardedAuthState = {
  isSignedIn: true,
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

    expect(result).toEqual(defaultCopyrightRequirements);
  });

  it("returns the correct state when signed out with resource not georestricted but login required", () => {
    const result = getComplexCopyrightState({
      authState: signedOutAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual(signedOutLoginRequired);
  });

  it("returns the correct state when signed out with georestricted resource and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedOutAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual(signedOutGeoRestricted);
  });

  it("returns the correct state when signed out with georestricted resource and login required", () => {
    const result = getComplexCopyrightState({
      authState: signedOutAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual({
      ...signedOutGeoRestricted,
      showSignedOutLoginRequired: true,
    });
  });

  it("returns the correct state when signed in but georestricted with resource not restricted and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeorestrictedAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual(defaultCopyrightRequirements);
  });

  it("returns the correct state when signed in but georestricted with resource not restricted but login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeorestrictedAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual(defaultCopyrightRequirements);
  });

  it("returns the correct state when signed in but georestricted with georestricted resource and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeorestrictedAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual(signedInGeoBlocked);
  });

  it("returns the correct state when signed in but georestricted with georestricted resource and login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeorestrictedAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual(signedInGeoBlocked);
  });

  it("returns the correct state when signed in but not onboarded with resource not restricted and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInNotOnboardedAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual(defaultCopyrightRequirements);
  });

  it("returns the correct state when signed in but not onboarded with resource not restricted but login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInNotOnboardedAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual(signedInNotOnboarded);
  });

  it("returns the correct state when signed in but not onboarded with georestricted resource and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInNotOnboardedAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual({
      ...signedInNotOnboarded,
      isResourceGeorestricted: true,
      showGeoBlocked: true,
    });
  });

  it("returns the correct state when signed in but not onboarded with georestricted resource and login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInNotOnboardedAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual({
      ...signedInNotOnboarded,
      isResourceGeorestricted: true,
      showGeoBlocked: true,
    });
  });

  it("returns the correct state when signed in and geo-authenticated with resource not restricted and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeoAuthenticatedAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual(defaultCopyrightRequirements);
  });

  it("returns the correct state when signed in and geo-authenticated with resource not restricted but login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeoAuthenticatedAuthState,
      resourceIsGeorestricted: false,
      resourceRequiresLogin: true,
      isLoaded: true,
    });

    expect(result).toEqual(defaultCopyrightRequirements);
  });

  it("returns the correct state when signed in and geo-authenticated with georestricted resource and no login required", () => {
    const result = getComplexCopyrightState({
      authState: signedInGeoAuthenticatedAuthState,
      resourceIsGeorestricted: true,
      resourceRequiresLogin: false,
      isLoaded: true,
    });

    expect(result).toEqual({
      ...defaultCopyrightRequirements,
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
      ...defaultCopyrightRequirements,
      isResourceGeorestricted: true,
    });
  });
});
