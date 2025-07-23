import { UseCopyrightRequirementsReturn } from "@/hooks/useCopyrightRequirements";

export const signedOutLoginRequired: UseCopyrightRequirementsReturn = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: true,
};

export const signedInGeoBlocked: UseCopyrightRequirementsReturn = {
  showGeoBlocked: true,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: false,
};

export const signedOutGeoRestricted: UseCopyrightRequirementsReturn = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: true,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: false,
};

export const signedInNotOnboarded: UseCopyrightRequirementsReturn = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: true,
  showSignedOutLoginRequired: false,
};

export const defaultCopyrightRequirements: UseCopyrightRequirementsReturn = {
  showGeoBlocked: false,
  showSignedOutGeoRestricted: false,
  showSignedInNotOnboarded: false,
  showSignedOutLoginRequired: false,
};
