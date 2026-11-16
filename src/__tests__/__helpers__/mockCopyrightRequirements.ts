import { ComplexCopyrightStatus } from "@/utils/complexCopyright/complexCopyright.types";

export const signedOutLoginRequired: ComplexCopyrightStatus = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: true,
  isLoaded: true,
  isResourceGeorestricted: false,
};

export const signedInGeoBlocked: ComplexCopyrightStatus = {
  showGeoBlocked: true,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: false,
  isLoaded: true,
  isResourceGeorestricted: true,
};

export const signedOutGeoRestricted: ComplexCopyrightStatus = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: true,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: false,
  isLoaded: true,
  isResourceGeorestricted: true,
};

export const signedInNotOnboarded: ComplexCopyrightStatus = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: true,
  showSignedOutLoginRequired: false,
  isLoaded: true,
  isResourceGeorestricted: false,
};

export const defaultCopyrightRequirements: ComplexCopyrightStatus = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: false,
  isLoaded: true,
  isResourceGeorestricted: false,
};

export const isLoading: ComplexCopyrightStatus = {
  ...defaultCopyrightRequirements,
  isLoaded: false,
};
