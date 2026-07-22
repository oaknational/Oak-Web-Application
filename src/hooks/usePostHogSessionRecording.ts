import { useUser } from "@clerk/nextjs";
import { useFeatureFlagEnabled, usePostHog } from "posthog-js/react";
import { useEffect } from "react";

/**
 * Starts or stops PostHog session recording based on the user's sign-in state
 * and the provided feature flag. Recording only runs when both conditions are true,
 * ensuring sessions are not recorded after a user signs out.
 */
export function usePostHogSessionRecording(featureFlag: string) {
  const postHog = usePostHog();
  const { isSignedIn } = useUser();
  const enabled = useFeatureFlagEnabled(featureFlag);

  useEffect(() => {
    if (isSignedIn && enabled) {
      postHog.startSessionRecording();
    } else {
      // important to prevent searches being recorded after a user signs out
      postHog.stopSessionRecording();
    }
  }, [enabled, isSignedIn, postHog]);
}
