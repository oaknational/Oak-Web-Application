import { useFeatureFlagEnabled } from "posthog-js/react";

import { ENABLE_NEW_TOPNAV } from "@/config/flags";

export function useIsNewTopnavEnabled(): boolean {
  const featureFlagValue = useFeatureFlagEnabled("teachers-new-top-nav");

  return ENABLE_NEW_TOPNAV || featureFlagValue;
}
