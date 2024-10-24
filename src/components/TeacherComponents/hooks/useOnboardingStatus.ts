import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

/**
 * Returns the onboarding status for the current session
 *
 * `loading` while Clerk is loading
 * `not-onboarded` when there is no active user or the active user has not completed onboarding
 * `onboarded` when the active user has completed onboarding
 * `unknown` if Clerk fails to load in 10 seconds
 */
export function useOnboardingStatus() {
  const { isLoaded, user } = useUser();
  const [hasTimedout, setHasTimedout] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Don't trust 3rd parties to ever load
  useEffect(() => {
    const timer = (timerRef.current = setTimeout(() => {
      setHasTimedout(true);
    }, 10000));

    return () => clearTimeout(timer);
  }, []);

  if (isLoaded) {
    typeof timerRef.current === "number" && clearTimeout(timerRef.current);
    timerRef.current = null;

    return user?.publicMetadata.owa?.isOnboarded
      ? "onboarded"
      : "not-onboarded";
  }

  if (hasTimedout) {
    return "unknown";
  }

  return "loading";
}
