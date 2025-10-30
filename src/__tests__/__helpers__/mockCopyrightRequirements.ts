import { UseComplexCopyrightReturn } from "@/hooks/useComplexCopyright";

export const signedOutLoginRequired: UseComplexCopyrightReturn = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: true,
  isLoaded: true,
};

export const signedInGeoBlocked: UseComplexCopyrightReturn = {
  showGeoBlocked: true,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: false,
  isLoaded: true,
};

export const signedOutGeoRestricted: UseComplexCopyrightReturn = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: true,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: false,
  isLoaded: true,
};

export const signedInNotOnboarded: UseComplexCopyrightReturn = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: true,
  showSignedOutLoginRequired: false,
  isLoaded: true,
};

export const defaultCopyrightRequirements: UseComplexCopyrightReturn = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: false,
  isLoaded: true,
};

export const isLoading: UseComplexCopyrightReturn = {
  ...defaultCopyrightRequirements,
  isLoaded: false,
};
