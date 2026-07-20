import Cookies from "js-cookie";
import { useEffect } from "react";

import { getExperimentCookieKey } from "./cookieHelpers";

import useAnalytics from "@/context/Analytics/useAnalytics";

export const useCaptureFeatureFlag = (flagKey: string) => {
  const { trackFeatureFlag } = useAnalytics();
  useEffect(() => {
    // Track call to feature flag when cookie has been set
    const cookieKey = getExperimentCookieKey(flagKey);
    const variant = Cookies.get(cookieKey);
    if (!variant || !trackFeatureFlag) return;

    trackFeatureFlag({
      $feature_flag: flagKey,
      $feature_flag_response: variant,
    });
  }, [trackFeatureFlag, flagKey]);
};
