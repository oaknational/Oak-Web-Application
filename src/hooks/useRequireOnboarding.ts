import { useRouter } from "next/router";
import { useEffect } from "react";

import { useFeatureFlaggedClerk } from "@/context/FeatureFlaggedClerk/FeatureFlaggedClerk";
import { resolveOakHref } from "@/common-lib/urls";

// 500 and 404 pages are included to avoid an infinite redirect loop
// should the onboarding page break
const skipFor = ["/onboarding", "/500", "/404"];

/**
 * Redirects the user to onboarding after login
 * when they have not previously completed onboarding
 */
export function useRequireOnboarding() {
  const { useUser } = useFeatureFlaggedClerk();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (skipFor.some((route) => router.pathname.startsWith(route))) {
      return;
    }

    if (user && !user.publicMetadata?.owa?.isOnboarded) {
      router.replace({
        pathname: resolveOakHref({ page: "onboarding" }),
        query: { returnTo: router.asPath },
      });
    }
  }, [user, router]);
}
