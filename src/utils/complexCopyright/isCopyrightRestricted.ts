import { ComplexCopyrightStatus } from "./complexCopyright.types";

export const isCopyrightRestricted = ({
  showSignedOutLoginRequired,
  showSignedOutGeoRestricted,
  showSignedInNotOnboarded,
  showGeoBlocked,
}: Pick<
  ComplexCopyrightStatus,
  | "showSignedOutLoginRequired"
  | "showSignedOutGeoRestricted"
  | "showSignedInNotOnboarded"
  | "showGeoBlocked"
>): boolean =>
  showSignedOutLoginRequired ||
  showSignedOutGeoRestricted ||
  showSignedInNotOnboarded ||
  showGeoBlocked;
