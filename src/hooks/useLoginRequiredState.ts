import { useMemo } from "react";

import {
  useCopyrightRequirements,
  UseCopyrightRequirementsReturn,
} from "@/hooks/useCopyrightRequirements";

export type LoginRequiredState =
  | "loading"
  | "action"
  | "onboarding"
  | "signup"
  | "georestricted"
  | "null";

type UseLoginRequiredStateParams = {
  loginRequired: boolean;
  geoRestricted: boolean;
  hasActionProps: boolean;
};

export function useLoginRequiredState({
  loginRequired,
  geoRestricted,
  hasActionProps,
}: UseLoginRequiredStateParams): {
  state: LoginRequiredState;
  copyrightReturn: UseCopyrightRequirementsReturn;
} {
  const {
    isLoaded,
    showGeoBlocked,
    showSignedInNotOnboarded,
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
  } = useCopyrightRequirements({ loginRequired, geoRestricted });

  const contentRestricted = loginRequired || geoRestricted;

  const state = useMemo((): LoginRequiredState => {
    if (!contentRestricted) return "action";
    if (!isLoaded) return "loading";
    if (showSignedOutGeoRestricted || showSignedOutLoginRequired) {
      return "signup";
    }
    if (showSignedInNotOnboarded) {
      return "onboarding";
    }
    if (hasActionProps) {
      if (showGeoBlocked) {
        return "georestricted";
      }
      return "action";
    }
    return "null";
  }, [
    contentRestricted,
    isLoaded,
    showSignedOutGeoRestricted,
    showSignedOutLoginRequired,
    showSignedInNotOnboarded,
    hasActionProps,
    showGeoBlocked,
  ]);

  return {
    state,
    copyrightReturn: {
      isLoaded,
      showGeoBlocked,
      showSignedInNotOnboarded,
      showSignedOutGeoRestricted,
      showSignedOutLoginRequired,
    },
  };
}
