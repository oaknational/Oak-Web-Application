import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

// 500 and 404 pages are included to avoid an infinite redirect loop
// should the onboarding page break
const skipFor = ["/onboarding", "/500", "/404"];

/**
 * Redirects the user to onboarding after login
 * when they have not previously completed onboarding
 */
export function useRequireOnboarding() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (skipFor.some((route) => router.pathname.startsWith(route))) {
      return;
    }

    if (user && !user["owa:onboarded"]) {
      router.replace({
        pathname: "/onboarding",
        query: { returnTo: router.asPath },
      });
    }
  }, [user, router]);
}
