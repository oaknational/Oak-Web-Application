import Cookies from "js-cookie";
import { useEffect } from "react";

import { getExperimentCookieKey } from "./cookieHelpers";

import useAnalytics from "@/context/Analytics/useAnalytics";

export const useCaptureFeatureFlag = (flagKey: string) => {
  const { trackFeatureFlag } = useAnalytics();
  useEffect(() => {
    // Report the user's assigned feature-flag variant after it has been stored in a cookie by the experiment middleware.
    // This exposure event links the user's subsequent events to the correct experiment variant.
    const cookieKey = getExperimentCookieKey(flagKey);
    const variant = Cookies.get(cookieKey);
    if (!variant || !trackFeatureFlag) return;

    trackFeatureFlag({
      $feature_flag: flagKey,
      $feature_flag_response: variant,
      [`$feature_flag/${flagKey}`]: variant,
    });
  }, [trackFeatureFlag, flagKey]);
};
