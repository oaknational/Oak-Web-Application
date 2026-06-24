import { useFeatureFlagEnabled } from "posthog-js/react";

import { ENABLE_HEATWAVE_BANNER } from "@/config/flags";

export function useIsHeatwaveBannerEnabled(): boolean {
  const featureFlagValue = useFeatureFlagEnabled("heatwave-banner");

  return ENABLE_HEATWAVE_BANNER || featureFlagValue;
}
