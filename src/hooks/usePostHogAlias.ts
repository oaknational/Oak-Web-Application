import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

import useAnalytics from "@/context/Analytics/useAnalytics";

/**
 * Handles PostHog aliasing when a user signs in.
 * This connects their anonymous PostHog ID (from cookies) with their Clerk user ID.
 */
export function usePostHogAlias() {
  const { posthogDistinctId, alias } = useAnalytics();
  const { user } = useUser();
  useEffect(() => {
    if (!user || !posthogDistinctId) {
      return;
    }

    alias?.(posthogDistinctId, user.id);
  }, [user, posthogDistinctId, alias]);
}
